import { admins } from '../config/mongoCollections.js';
import Validation from '../helpers.js';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

async function createAdmin(userName, email, hashedPassword) {
    if (!userName || !email || !hashedPassword) {
        throw 'All fields must have valid values';
    }

    userName = Validation.checkString(userName, "Username");
    email = Validation.checkEmail(email).toLowerCase();
    hashedPassword = Validation.checkString(hashedPassword, "Hashed password");

    const adminCollection = await admins();
    const findName = await findAdminByUsername(userName);
    if (findName) throw "Username already exists";
    const findEmail = await findAdminByEmail(email);
    if (findEmail) throw "Email already exists";

    const newAdmin = {
        userName: userName,
        email: email,
        hashedPassword: hashedPassword,
        role: "admin",
        createdAt: new Date().toISOString()
    };

    const insertInfo = await adminCollection.insertOne(newAdmin);
    if (!insertInfo.insertedId) throw 'Failed to create admin';
    return await findAdminById(insertInfo.insertedId.toString());
}

async function findAdminById(adminId) {
    if (!adminId) throw 'Admin ID is required';
    adminId = Validation.checkId(adminId);
    const adminCollection = await admins();
    const admin = await adminCollection.findOne({ _id: new ObjectId(adminId) });
    if (!admin) return null;
    admin._id = admin._id.toString();
    return admin;
}

async function findAdminByUsername(username) {
    if (!username) throw 'Username is required';
    username = Validation.checkString(username, "Username");
    const adminCollection = await admins();
    const admin = await adminCollection.findOne({ userName: username });
    if (!admin) return null;
    admin._id = admin._id.toString();
    return admin;
}

async function findAdminByEmail(email) {
    if (!email) throw 'Email is required';
    email = Validation.checkEmail(email);
    const adminCollection = await admins();
    const admin = await adminCollection.findOne({ email: email });
    if (!admin) return null;
    admin._id = admin._id.toString();
    return admin;
}

async function getAllAdmins() {
    const adminCollection = await admins();
    return await adminCollection.find({}).toArray();
}

async function updateAdmin(adminId, updateData) {
    if (!adminId) throw 'Admin ID is required';
    adminId = Validation.checkId(adminId);
    
    const adminCollection = await admins();
    const existingAdmin = await findAdminById(adminId);
    if (!existingAdmin) throw 'Admin not found';

    const updates = {};
    if (updateData.userName) {
        const existingUsername = await findAdminByUsername(updateData.userName);
        if (existingUsername && existingUsername._id !== adminId) throw 'Username already exists';
        updates.userName = Validation.checkString(updateData.userName, "Username");
    }
    if (updateData.email) {
        const existingEmail = await findAdminByEmail(updateData.email);
        if (existingEmail && existingEmail._id !== adminId) throw 'Email already exists';
        updates.email = Validation.checkEmail(updateData.email).toLowerCase();
    }
    if (updateData.hashedPassword) {
        updates.hashedPassword = Validation.checkString(updateData.hashedPassword, "Hashed password");
    }

    const result = await adminCollection.updateOne(
        { _id: new ObjectId(adminId) },
        { $set: updates }
    );

    if (result.modifiedCount === 0) throw 'No changes made';
    return await findAdminById(adminId);
}

async function removeAdmin(adminId) {
    if (!adminId) throw 'Admin ID is required';
    adminId = Validation.checkId(adminId);
    
    const adminCollection = await admins();
    const deletionInfo = await adminCollection.deleteOne({ _id: new ObjectId(adminId) });
    
    if (deletionInfo.deletedCount === 0) throw 'Failed to delete admin';
    return { deleted: true, id: adminId };
}

async function checkAdminLogin(userName, password) {
    if (!userName || !password) throw 'Username and password are required';
    
    userName = Validation.checkString(userName, "Username");
    password = Validation.checkString(password, "Password");
    
    const admin = await findAdminByUsername(userName);
    if (!admin) throw 'Invalid credentials';
    
    const match = await bcrypt.compare(password, admin.hashedPassword);
    if (!match) throw 'Invalid credentials';
    
    return admin;
}

export {
    createAdmin,
    findAdminById,
    findAdminByUsername,
    findAdminByEmail,
    getAllAdmins,
    updateAdmin,
    removeAdmin,
    checkAdminLogin
};