const createAppointmentSlots = () => {
  const slots = [];
  const daysString = ["SUN", "MON", "TUES", "WEDS", "THURS", "FRI", "SAT"];
  const times = [
    "10:00:00",
    "12:00:00",
    "14:00:00",
    "16:00:00",
    "18:00:00",
    "20:00:00",
  ];
  for (let i = 1; i < 8; i++) {
    const dayOfWeek = new Date(Date.now() + i * 24 * 60 * 60 * 1000);

    const day = daysString[dayOfWeek.getDay()];
    const date =
      dayOfWeek.getDate() < 10
        ? `0${dayOfWeek.getDate()}`
        : `${dayOfWeek.getDate()}`;
    const month =
      dayOfWeek.getMonth() + 1 < 10
        ? `0${dayOfWeek.getMonth() + 1}`
        : `${dayOfWeek.getMonth() + 1}`;
    const year = `${dayOfWeek.getFullYear()}`;

    const fullDate = `${day} ${date}/${month}/${year}`;

    const timestamps = [];
    for (let j = 0; j < times.length; j++) {
      timestamps.push(`${year}-${month}-${date} ${times[j]}`);
    }
    slots.push({ fullDate, times, timestamps });
  }
  return slots;
};

const filterAppointmentSlots = (slots, callbacks, customerID) => {
  let existingCallback = null;
  //TRIPLE FOR LOOP!!!
  for (let i = 0; i < slots.length; i++) {
    for (let j = 0; j < slots[i]["timestamps"].length; j++) {
      for (let k = 0; k < callbacks.length; k++) {
        //if callback already booked, delete from slots
        if (
          new Date(slots[i]["timestamps"][j]).toString() ===
          new Date(callbacks[k]["call_from"]).toString()
        ) {
          //get existing customer callback if exists
          if (
            callbacks[k]["customer_id"] === customerID &&
            callbacks[k]["is_current"] === 1
          ) {
            existingCallback = callbacks[k];
          }
          slots[i]["timestamps"] = slots[i]["timestamps"].filter(
            (t, index) => index !== j
          );
          slots[i]["times"] = slots[i]["times"].filter(
            (t, index) => index !== j
          );
          j--;
        }
      }
    }
  }

  
  const filteredSlots = slots;
  return {
    filteredSlots,
    existingCallback,
  };
};

ValidationCodegenerator=()=>{
  var validationCode= String(Math.random().toString().substring(2, 6));
  return validationCode;
}

module.exports = {
  ValidationCodegenerator,
  createAppointmentSlots,
  filterAppointmentSlots,
};
