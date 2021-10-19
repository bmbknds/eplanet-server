import { success, notFound } from "../../services/response/";
import { Student } from ".";
import { User } from "../user";

export const create = ({ bodymen: { body } }, res, next) =>
  Student.create(body)
    .then((student) => student.view(true))
    .then(success(res, 201))
    .catch(next);

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Student.find(query, select, cursor)
    .populate("parentId", "_id, name")
    .then((students) => students.map((student) => student.view()))
    .then(success(res))
    .catch(next);

export const show = ({ params }, res, next) =>
  Student.findById(params.id)
    .populate("parentId", "_id name email phoneNumber")
    .then(notFound(res))
    .then((student) => (student ? student.view() : null))
    .then(success(res))
    .catch(next);

export const update = ({ bodymen: { body }, params }, res, next) =>
  Student.findById(params.id)
    .then(notFound(res))
    .then((student) => (student ? Object.assign(student, body).save() : null))
    .then((student) => (student ? student.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ params }, res, next) =>
  Student.findById(params.id)
    .then(notFound(res))
    .then((student) => (student ? student.remove() : null))
    .then(success(res, 204))
    .catch(next);

const checkParentAccountExist = async (email) => {
  const user = await User.findOne({ email });
  console.log(email, "-----", user);
  return user;
};

const createChild = async (parentId, child) => {
  return await Student.create(child).then((childData) => {
    return User.findByIdAndUpdate(
      parentId,
      { $push: { students: childData._id } },
      { new: true, useFindAndModify: false }
    );
  });
};

export const importStudent = async (item) => {
  if (item.parentTel && item.parentEmail) {
    //check parent existed

    let parent = await checkParentAccountExist(item.parentEmail);
    console.log("email", item.parentEmail, parent);
    let parentId = null;
    if (parent) {
      parentId = parent._id;
    } else {
      //tạo phụ huynh
      const parentCreated = await User.create({
        role: "student",
        status: "active",
        name: item.parentName,
        email: item.parentEmail,
        password: "123456",
        phoneNumber: item.parentTel,
        gender: item.parentGender,
      });
      parentId = parentCreated._id;
    }
    //tạo con
    await createChild(parentId, {
      parentId: parentId,
      studentName: item.studentName,
      age: item.age,
      idNumber: item.idNumber,
      nickName: item.nickName,
      skype: item.skype,
      facebook: item.facebook,
      note: item.note,
    });
    return;
  }
};

export const importData = async ({ body }, res, next) => {
  const _data = body.data;
  for await (const student of _data) {
    await importStudent(student);
  }
  return res.status(200).json({
    status: 1,
    message: "Success",
  });
};
