const customerID = document.getElementById("customer-id").value;
const tokenID = document.getElementById("token-id").value;
const tokenCreationTime = document.getElementById("token-created-at").value;
const validationStatus = document.getElementById("validation-status");

let validationInterval = setInterval(fetchTokenStatus, 3000);

async function fetchTokenStatus() {
  let is_validated;
  try {
    const response = await fetch(
      `http://localhost:3000/customer/${customerID}/validationresponse/${tokenID}`
    );

    const data = await response.json();
    is_validated = data["is_validated"];

    validationStatus.innerHTML =
      is_validated === 0
        ? "Await Validation message, bear with us..."
        : "Agent Validated ";
  } catch (error) {
    console.log("ERROR", error);
  }
  const diff = Math.abs(new Date() - new Date(tokenCreationTime));
  const minutes = Math.floor(diff / 1000 / 60);

  if (minutes > 65) {
    clearInterval(validationInterval);
    validationStatus.innerHTML = "Token expired, please terminate call";
  } else if (is_validated === 1) {
    clearInterval(validationInterval);
  }
}
