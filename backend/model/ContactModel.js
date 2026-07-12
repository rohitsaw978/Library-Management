const { model } = require("mongoose");
const { ContactSchema } = require("../schemas/ContactSchema");

const ContactModel = model("Contact", ContactSchema);

module.exports = { ContactModel };