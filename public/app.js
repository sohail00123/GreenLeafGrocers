// Array declaration to store inventory items
let inventory = [];

// Creating unique IDs to refer unique inventory items
const generateId = () => {
  return inventory.length > 0 ? Math.max(...inventory.map(item => item.id)) + 1 : 1;
};

// Fetching existing stock data
const loadInventory = async () => {
  try {
    // "inventory.json" <--API-endpoint-- Programming Environment
    const response = await fetch('/data/inventory.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch inventory. Status: ${response.status}`);
    }
    inventory = await response.json();
    renderInventory();
  } catch (err) {
    console.error('Error loading inventory:', err);
    inventory = [];
    renderInventory();
  }
};

// Saving inventory data through POST method and API endpoint pointing to the source "inventory.json"
const saveInventory = async () => {
  try {
    const response = await fetch('/data/inventory.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inventory),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log('Inventory saved successfully!');
  } catch (err) {
    console.error('Error saving inventory:', err);
  }
};

// Rendering inventory table
const renderInventory = () => {
  const tableBody = document.querySelector('#inventory-table tbody');
  tableBody.innerHTML = ''; // flushing data from existing rows

  if (inventory.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7">No items in inventory</td></tr>';
    return;
  }

  inventory.forEach((item) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>${item.quantity}</td>
      <td>${item.expiry}</td>
      <td>
        <button class="edit-btn" onclick="startEdit(${item.id})">Edit</button>
        <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
};

// Data insertion
const addItem = (item) => {
  inventory.push(item);
  renderInventory();
  saveInventory();
};

// Data updation
const updateItem = (id, updatedItem) => {
  inventory = inventory.map((item) => (item.id === id ? { ...item, ...updatedItem } : item));
  renderInventory();
  saveInventory();
};

// Data deletion
const deleteItem = (id) => {
  if (confirm('Are you sure you want to delete this item?')) {
    inventory = inventory.filter((item) => item.id !== id);
    renderInventory();
    saveInventory();
  }
};

// Editing existing items
const startEdit = (id) => {
  const item = inventory.find((item) => item.id === id);
  if (item) {
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-category').value = item.category;
    document.getElementById('item-price').value = item.price;
    document.getElementById('item-quantity').value = item.quantity;
    document.getElementById('item-expiry').value = item.expiry;

    // Update item button
    const submitButton = document.querySelector('#add-item-form button');
    submitButton.innerText = 'Update Item';
    submitButton.setAttribute('onclick', `updateItemSubmit(${id})`); // Change function to update
  } else {
    alert('Item not found!');
  }
};

// Updating existing inventory data through form submission mechanism
const updateItemSubmit = (id) => {
  const updatedItem = {
    name: document.getElementById('item-name').value.trim(),
    category: document.getElementById('item-category').value.trim(),
    price: parseFloat(document.getElementById('item-price').value),
    quantity: parseInt(document.getElementById('item-quantity').value, 10),
    expiry: document.getElementById('item-expiry').value,
  };

  if (validateInput(updatedItem)) {
    updateItem(id, updatedItem);
    resetForm();
  }
};

// Defining logic to reset form 
const resetForm = () => {
  const submitButton = document.querySelector('#add-item-form button');
  submitButton.innerText = 'Add Item';
  submitButton.setAttribute('onclick', 'addItemSubmit(event)'); // Reset to add item

  document.getElementById('add-item-form').reset();
};

// Validate form input
const validateInput = (item) => {
  if (!item.name || !item.category || !item.expiry) {
    alert('All fields are required.');
    return false;
  }
  if (item.price <= 0 || item.quantity <= 0) {
    alert('Price and Quantity must be greater than zero.');
    return false;
  }
  return true;
};

// Handling add item form submission
const addItemSubmit = (e) => {
  e.preventDefault();

  const newItem = {
    id: generateId(),
    name: document.getElementById('item-name').value.trim(),
    category: document.getElementById('item-category').value.trim(),
    price: parseFloat(document.getElementById('item-price').value),
    quantity: parseInt(document.getElementById('item-quantity').value, 10),
    expiry: document.getElementById('item-expiry').value,
  };

  if (validateInput(newItem)) {
    addItem(newItem);
    resetForm();
  }
};

// Loading inventory data on page load
document.addEventListener('DOMContentLoaded', () => {
  loadInventory();
});

// Attaching form submission event for adding item
document.getElementById('add-item-form').addEventListener('submit', addItemSubmit);