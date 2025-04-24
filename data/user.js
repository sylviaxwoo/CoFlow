import { users } from '../config/mongoCollections.js'
import Validation from '../helpers.js'
import { ObjectId } from 'mongodb';
async function createUser(userName, firstName, lastName, email, hashedPassword, bio, gender, city, state, dob, courses, education, terms, privacy) {
    if (!userName ||
        !firstName ||
        !lastName ||
        !email ||
        !hashedPassword ||
        !terms ||
        !privacy
    )
        throw 'basic info fields need to have valid values';
    userName = Validation.checkString(userName, "Validate username").toLowerCase();
    firstName = Validation.checkString(firstName, "Validate firstName").toLowerCase();
    lastName = Validation.checkString(lastName, "Validate lastName").toLowerCase();
    email = Validation.checkEmail(email).toLowerCase();
    hashedPassword = Validation.checkString(hashedPassword, "hashedPassword");

    bio = bio ? Validation.checkString(bio, "bio") : '';
    gender = gender ? Validation.checkGender(gender, "gender") : '';
    city = city ? Validation.checkString(city, "city") : '';
    state = state ? Validation.checkString(state, "state") : '';
    dob = dob ? Validation.checkDate(dob) : '';
    courses = courses ? Validation.checkStringArray(courses) : [];
    education = education ? Validation.checkEducation(education) : [];
    if (terms != 'on' || privacy != 'on') throw 'privacy and term must be agreed'
    let newuser = {
        userName: userName,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        bio: bio,
        gender: gender,
        state: state,
        city: city,
        dob: dob,
        courses: courses,
        education: education,
        terms: terms,
        privacy: privacy
    }

    const userCollection = await users();
    const newInsertInformation = await userCollection.insertOne(newuser);
    if (!newInsertInformation.insertedId) throw 'Insert failed!';
    return await this.findUserById(newInsertInformation.insertedId.toString());
};

async function findUserByUsername(username) {
    if (!username) throw 'You must provide an username to search for';
    username = Validation.checkString(username, "check username");
    const userCollection = await users();
    const findUser = await userCollection.findOne({ username: username });
    if (findUser === null) return null;
    findUser._id = findUser._id.toString();
    return findUser;
};

async function findUserByEmail(email) {
    if (!email) throw 'You must provide an email to search for';
    email = Validation.checkEmail(email);
    const userCollection = await users();
    const findUser = await userCollection.findOne({ email: email });
    if (findUser === null) return null;
    findUser._id = findUser._id.toString();
    return findUser;
};

async function findUserById(userId) {
    if (!userId) throw 'You must provide an userId to search for';
    userId = Validation.checkId(userId);
    const userCollection = await users();
    const findUser = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (findUser === null) return null;
    findUser._id = findUser._id.toString();
    return findUser;
};

async function getAllUsers() {
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    return userList;
};

async function updateUser() {

};

async function removeUser(userId) {
    if (!userId) throw 'Need to provide userId';
    userId = Validation.checkID(userId);
    const userCollection = await users();
    const user = await findUserById(userId);
    if (user === null) throw 'No user with that id';

    const deletionInfo = await userCollection.deleteOne({ _id: ObjectId(userId) });

    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete Band with id of ${userId}`;
    } else {
        return true;
    }
};

async function checkLogin() {

};

export { createUser, findUserByEmail, findUserByUsername, findUserById, getAllUsers, updateUser, removeUser };