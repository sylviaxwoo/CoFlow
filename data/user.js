import { users } from '../config/mongoCollections'
import Validation from '../helpers.js'

async function createUser(userData) {
    const db = await connect();
    const users = db.collection('users');
    const result = await users.insertOne(userData);
    return result;
};

async function findUserByUsername(username) {
    const db = await connect();
    const users = db.collection('users');
    return await users.findOne({ userName: username });
};

async function findUserByEmail(email) {
    const db = await connect();
    const users = db.collection('users');
    return await users.findOne({ email: email });
};

async function findUserById(userId) {
    const db = await connect();
    const users = db.collection('users');
    return await users.findOne({ _id: new ObjectId(userId) });
};

async function getAllUsers() {};

async function updateUser() {};

async function removeUser() {};

export { createUser, findUserByEmail, findUserByUsername, findUserById, getAllUsers, updateUser, removeUser };