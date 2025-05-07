import { busers } from '../config/mongoCollections.js';
import Validation from '../helpers.js';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

async function createBuser(userName, company, email, phone, description, hashedPassword, address, city, state, courses, terms, privacy) {
    if (!userName || !company || !email || !phone || !description || !hashedPassword || !address || !city || !state || !courses || terms !== 'on' || privacy !== 'on') {
        throw 'All required fields must have valid values';
    }

    userName = Validation.checkString(userName, "Username");
    company = Validation.checkString(company, "Company");
    email = Validation.checkEmail(email).toLowerCase();
    phone = Validation.checkPhone(phone, "Phone");
    description = Validation.checkString(description, "Description");
    hashedPassword = Validation.checkString(hashedPassword, "Hashed password");
    address = Validation.checkString(address, "Address");
    city = Validation.checkString(city, "City");
    state = Validation.checkString(state, "State");
    courses = Validation.checkStringArray(courses, "Courses");

    const buserCollection = await busers();
    const existingUsername = await findBuserByUsername(userName);
    if (existingUsername) throw 'Username already exists';
    const existingEmail = await findBuserByEmail(email);
    if (existingEmail) throw 'Email already exists';

    const newBuser = {
        userName,
        company,
        email,
        phone,
        description,
        hashedPassword,
        address,
        city,
        state,
        courses,
        terms: true,
        privacy: true,
        role: "business",
        createdAt: new Date().toISOString(),
        schedule: [],
        notificationSettings: {},
        createdGroups: [],
        joinedGroups: []
    };

    const insertInfo = await buserCollection.insertOne(newBuser);
    if (!insertInfo.insertedId) throw 'Failed to create business user';
    return await findBuserById(insertInfo.insertedId.toString());
}

async function findBuserById(buserId) {
    if (!buserId) throw 'Business user ID is required';
    buserId = Validation.checkId(buserId);
    const buserCollection = await busers();
    const buser = await buserCollection.findOne({ _id: new ObjectId(buserId) });
    if (!buser) return null;
    buser._id = buser._id.toString();
    return buser;
}

async function findBuserByUsername(username) {
    if (!username) throw 'Username is required';
    username = Validation.checkString(username, "Username");
    const buserCollection = await busers();
    const buser = await buserCollection.findOne({ userName: username });
    if (!buser) return null;
    buser._id = buser._id.toString();
    return buser;
}

async function findBuserByEmail(email) {
    if (!email) throw 'Email is required';
    email = Validation.checkEmail(email);
    const buserCollection = await busers();
    const buser = await buserCollection.findOne({ email: email });
    if (!buser) return null;
    buser._id = buser._id.toString();
    return buser;
}

async function getAllBusers() {
    const buserCollection = await busers();
    return await buserCollection.find({}).toArray();
}

async function updateBuser(buserId, updateData) {
    if (!buserId) throw 'Business user ID is required';
    buserId = Validation.checkId(buserId);
    
    const buserCollection = await busers();
    const existingBuser = await findBuserById(buserId);
    if (!existingBuser) throw 'Business user not found';

    const updates = {};
    if (updateData.userName) {
        const existingUsername = await findBuserByUsername(updateData.userName);
        if (existingUsername && existingUsername._id !== buserId) throw 'Username already exists';
        updates.userName = Validation.checkString(updateData.userName, "Username");
    }
    if (updateData.company) updates.company = Validation.checkString(updateData.company, "Company");
    if (updateData.email) {
        const existingEmail = await findBuserByEmail(updateData.email);
        if (existingEmail && existingEmail._id !== buserId) throw 'Email already exists';
        updates.email = Validation.checkEmail(updateData.email).toLowerCase();
    }
    if (updateData.phone) updates.phone = Validation.checkPhone(updateData.phone, "Phone");
    if (updateData.description) updates.description = Validation.checkString(updateData.description, "Description");
    if (updateData.hashedPassword) updates.hashedPassword = Validation.checkString(updateData.hashedPassword, "Hashed password");
    if (updateData.address) updates.address = Validation.checkString(updateData.address, "Address");
    if (updateData.city) updates.city = Validation.checkString(updateData.city, "City");
    if (updateData.state) updates.state = Validation.checkString(updateData.state, "State");
    if (updateData.courses) updates.courses = Validation.checkStringArray(updateData.courses, "Courses");

    const result = await buserCollection.updateOne(
        { _id: new ObjectId(buserId) },
        { $set: updates }
    );

    if (result.modifiedCount === 0) throw 'No changes made';
    return await findBuserById(buserId);
}

async function removeBuser(buserId) {
    if (!buserId) throw 'Business user ID is required';
    buserId = Validation.checkId(buserId);
    
    const buserCollection = await busers();
    const deletionInfo = await buserCollection.deleteOne({ _id: new ObjectId(buserId) });
    
    if (deletionInfo.deletedCount === 0) throw 'Failed to delete business user';
    return { deleted: true, id: buserId };
}

async function checkBuserLogin(userName, password) {
    if (!userName || !password) throw 'Username and password are required';
    
    userName = Validation.checkString(userName, "Username");
    password = Validation.checkString(password, "Password");
    
    const buser = await findBuserByUsername(userName);
    if (!buser) throw 'Invalid credentials';
    
    const match = await bcrypt.compare(password, buser.hashedPassword);
    if (!match) throw 'Invalid credentials';
    
    return buser;
}

export {
    createBuser,
    findBuserById,
    findBuserByUsername,
    findBuserByEmail,
    getAllBusers,
    updateBuser,
    removeBuser,
    checkBuserLogin
};