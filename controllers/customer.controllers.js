const jwt = require("jsonwebtoken");
const { createAppointmentSlots, filterAppointmentSlots } = require("../utils");

const getCustomerLogin = function (req, res, next) {
  res.render("customer/login.html");
};

const postCustomerLogin = function (req, res, next) {
  const query = "SELECT id FROM customers WHERE username=? AND password=?";
  const { username, password } = req.body;
  const values = [username, password];
  db.query(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else if (rows.length === 0) {
      return (
        res
          .status(403)
          //.send("You do not have permission to access this resource");
          .render("agent/invalidlogin.html")
      );
    } else {
      const customer = rows[0];
      const token = jwt.sign({ customer }, process.env.SECRET_CUSTOMER_KEY, {
        expiresIn: "1h",
      });
      res.cookie("token", token, {
        httpOnly: true,
      });

      res.redirect(`/customer/${customer["id"]}`);
    }
  });
};

const getCustomerLogout = function (req, res) {
  res.clearCookie("token");
  res.render("customer/logout.ejs");
};

const getCustomer = function (req, res, next) {
  const query = "SELECT * FROM customers WHERE id=?";
  const customerID = req.customer.customer.id;
  const values = [customerID];

  db.query(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else {
      const customer = rows[0];
      res.render("customer/customer.ejs", {
        customer: customer,
      });
    }
  });
};

const getCallback = function (req, res, next) {
  const customerID = req.customer.customer.id;
  const slots = createAppointmentSlots();

  //compare offered slots with future booked slots only, not past booked slots
  const query =
    "SELECT callbacks.id AS callbackID, callbacks.call_from, callbacks.is_current, callbacks.customer_id FROM callbacks WHERE callbacks.call_from >= CURRENT_TIMESTAMP";
  const earliestSlotOffered = slots[0]["timestamps"][0];
  const values = [earliestSlotOffered];

  db.query(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else {
      const callbacks = rows; //callback variable to filter only available slots
      const { filteredSlots, existingCallback } = filterAppointmentSlots(
        slots,
        callbacks,
        customerID
      );
      res.render("customer/schedulecallback.ejs", {
        customerID: customerID,
        slots: filteredSlots,
        existingCallback: existingCallback,
      });
    }
  });
};

//SQL middleware
//delete existing booked slot if appointment rescheduled
const deleteExistingSlot = function (req, res, next) {
  if (req.body.hasOwnProperty("existing_callback_id")) {
    const { existing_callback_id } = req.body;
    const query = "DELETE FROM callbacks WHERE id = ?";
    const values = [existing_callback_id];
    console.log("deleted callback id:", existing_callback_id);
    db.query(query, values, function (err, rows) {
      if (err) {
        next(err);
      }
    });
  }
  next();
};

const postCallback = function (req, res, next) {
  const customerID = req.customer.customer.id;
  const slot = req.body.time;
  const query =
    "INSERT INTO callbacks (customer_id, created_at, call_from) VALUES (?, CURRENT_TIMESTAMP, ?)";
  const values = [customerID, slot];

  db.query(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else {
      res.render("customer/callbackconfirmation.html", {
        customerID: customerID,
        slot: slot,
      });
    }
  });
};

//route confirming cancellation of booked appointment
const postCancelCallback = function (req, res, next) {
  const { existing_callback_date } = req.body;
  res.render("customer/cancelconfirmation.html", {
    existing_callback_date: existing_callback_date,
  });
};

const getFraudReport = function (req, res, next) {
  const query = "SELECT * FROM customers WHERE id=?";
  const values = [req.customer.customer.id];

  db.query(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else {
      const customer = rows[0];
      res.render("customer/reportfraud.ejs", {
        customer: customer,
      });
    }
  });
};

const postFraudReport = function (req, res, next) {
  const query =
    "INSERT INTO fraud_reports (customer_id, fraud_time, fraud_tel, fraud_description) VALUES (?,?,?,?)";
  const customerID = req.customer.customer.id;
  const fraudTime = req.body.fraud_time;
  const fraudTel = req.body.fraud_tel;
  const fraudDescription = req.body.fraud_description;
  const values = [customerID, fraudTime, fraudTel, fraudDescription];

  db.query(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else {
      res.redirect(`/customer/${req.params.id}`);
    }
  });
};

const getValidate = function (req, res, next) {
  const query =
    "SELECT * FROM active_calls WHERE customer_id = ? ORDER BY created_at DESC LIMIT 1";
  const values = [req.customer.customer.id];
  db.query(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else {
      const active_call = rows[0];

      //minutes between - can be refactored as function
      //check time between now and active_call request
      // if greater than x amount minutes, token considerd expired

      const diff = Math.abs(new Date() - new Date(active_call["created_at"]));
      const minutes = Math.floor(diff / 1000 / 60);
      const expired = minutes > 65 ? true : false;

      res.render("customer/userHome.html", {
        active_call: active_call,
        expired: expired,
        customerID: values,
      });
    }
  });
};

//Function respond to API client-side fetch requests
const ApiValidationResponse = function (req, res, next) {
  const tokenID = req.params.token;

  const query = "SELECT * FROM active_calls WHERE id = ?";
  const values = [tokenID];
  db.query(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else {
      const active_call = rows[0];
      res.json(active_call);
    }
  });
};

module.exports = {
  getCustomerLogin,
  postCustomerLogin,
  getCustomerLogout,
  getCustomer,
  getCallback,
  deleteExistingSlot,
  postCallback,
  postCancelCallback,
  getFraudReport,
  postFraudReport,
  getValidate,
  ApiValidationResponse,
};
