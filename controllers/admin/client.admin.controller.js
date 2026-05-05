const Client = require("../../models/client.model");
const bcrypt = require("bcrypt");

const sanitizeClient = (client) => {
  const clientObject = client.toObject ? client.toObject() : client;
  delete clientObject.password;
  return clientObject;
};

const getAllClients = async (req, res) => {
  try {
    const { status, search } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    const clients = await Client.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clients.length,
      clients: clients.map(sanitizeClient),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
      error: error.message,
    });
  }
};

const getSingleClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      client: sanitizeClient(client),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch client",
      error: error.message,
    });
  }
};

const createClient = async (req, res) => {
  try {
    const { name, email, password, phone, company, status, notes } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await Client.create({
      name,
      email,
      password: hashedPassword,
      phone,
      company,
      status,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      client: sanitizeClient(client),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Client with this email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create client",
      error: error.message,
    });
  }
};

const updateClient = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Handle password update: hash if provided and non-empty, otherwise remove from update
    if (Object.prototype.hasOwnProperty.call(updateData, "password")) {
      if (updateData.password && updateData.password.trim().length > 0) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      } else {
        // Don't update password if empty or whitespace
        delete updateData.password;
      }
    }

    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      client: sanitizeClient(client),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Client with this email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update client",
      error: error.message,
    });
  }
};

const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete client",
      error: error.message,
    });
  }
};

module.exports = {
  getAllClients,
  getSingleClient,
  createClient,
  updateClient,
  deleteClient,
};
