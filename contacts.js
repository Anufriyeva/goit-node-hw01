const path = require('node:path');
const fs = require('node:fs/promises');
const {nanoid} = require('nanoid');

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
    try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Error reading contacts:', error.message);
    throw error;
  }
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  return contacts.find(contact => contact.id === contactId) || null;
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const removedContact = contacts.find(contact => contact.id === contactId);

    if (!removedContact) {
      return null; 
    }

    const updatedContacts = contacts.filter(contact => contact.id !== contactId);

    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2), 'utf-8');
    return removedContact;
  } catch (error) {
    console.error('Error removing contact:', error.message);
    throw error;
  }
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();

  const contactExists = contacts.some(contact => contact.name === name);

  if (contactExists) {
    return `Contact ${name} already exists!`;
  }

  const newContact = { id: nanoid(), name, email, phone };
  contacts.push(newContact);

  try {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), 'utf-8');
    return newContact;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};