import { admin, api } from '../config/mongoCollections.js'
import Validation from '../helpers.js'
import { ObjectId } from 'mongodb';
import { findUserByUsername } from './user.js';

async function createAdmin(userName, hashedPassword) {
    if (!userName ||
        !hashedPassword
    )
        throw 'Admin username and password fields need to have valid values';
    userName = Validation.checkString(userName, "Validate username");
    hashedPassword = Validation.checkString(hashedPassword, "hashedPassword");
    const adminCollection = await admin();

    var newAdmin = {
        userName: userName,
        hashedPassword: hashedPassword,
        role: "admin"
    }
    const newInsertInformation = await adminCollection.insertOne(newAdmin);
    if (!newInsertInformation.insertedId) throw 'Insert failed!';
    // return await this.findUserById(newInsertInformation.insertedId.toString());
    return await this.findAdminByadminName(userName);

};
async function findAdminById(adminId) {
    if (!adminId) throw 'You must provide an userId to search for';
    adminId = Validation.checkId(adminId);
    const adminCollection = await admin();
    const findAdmin = await adminCollection.findOne({ _id: new ObjectId(adminId) });
    if (findAdmin === null) return null;
    findAdmin._id = findAdmin._id.toString();
    return findAdmin;
};
async function findAdminByadminName(adminUserName) {
    if (!adminUserName) throw 'You must provide an username to search for';
    adminUserName = Validation.checkString(adminUserName, "check username");
    const adminCollection = await admin();
    const findAdmin = await adminCollection.findOne({ userName: adminUserName });
    if (findAdmin === null) return null;
    findAdmin._id = findAdmin._id.toString();
    return findAdmin;
};

async function getAllAdmin() {
    const adminCollection = await admin();
    const adminList = await adminCollection.find({}).toArray();
    adminList.forEach((element) => {
        element._id = element._id.toString();
    });
    return adminList;
};

async function removeAdmin(adminId) {

};
async function updateAdmin(adminId) {

};

async function addApiTestCase(caseId, url, method, body) {
    if (!caseId || !url || !method || !body) throw 'All fields of url, method, body must input';
    userName = Validation.checkId(caseId, "caseId");
    const apiCollection = await api();
    var newApiCase = {
        url: url,
        method: method,
        body: body
    }
    const newInsertInformation = await apiCollection.insertOne(newApiCase);
    if (!newInsertInformation.insertedId) throw 'Insert failed!';
    return await this.findApiCaseById(newInsertInformation.insertedId.toString());
};

async function findApiCaseById(caseId) {
    if (!caseId) throw 'must input caseId';
    caseId = Validation.checkId(caseId);
    const apiCollection = await api();
    const findApi = await apiCollection.findOne({ _id: new ObjectId(caseId) });
    if (findApi === null) return null;
    findApi._id = findApi._id.toString();
    return findApi;
}
async function updateApiTestCase(caseId) {
    if (!caseId) throw 'must input caseId';
};
async function DeleteApiTestCase(caseId) {
    if (!caseId) throw 'must input caseId';

};



export { createAdmin, findAdminById, findAdminByadminName, getAllAdmin, removeAdmin, updateAdmin, addApiTestCase, updateApiTestCase, DeleteApiTestCase, findApiCaseById }