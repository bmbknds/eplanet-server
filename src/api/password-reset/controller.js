import {
  success,
  notFound,
  notFoundInCollection,
} from "../../services/response/";
import { sendMail } from "../../services/sendgrid";
import { PasswordReset } from ".";
import { User } from "../user";

export const create = (
  {
    bodymen: {
      body: { email, link },
    },
  },
  res,
  next
) =>
  User.findOne({ email })
    .then(
      notFoundInCollection(res, {
        status: 404,
        message: "Your email is not registed!",
      })
    )
    .then((user) => (user ? PasswordReset.create({ user }) : null))
    .then((reset) => {
      if (!reset) return null;
      const { user, token } = reset;
      console.log(1);
      link = `${link.replace(/\/$/, "")}/${token}`;
      const content = `
        Hey, ${user.name}.<br><br>
        You requested a new password for your ePlanet account.<br>
        Please use the following link to set a new password. It will expire in 1 hour.<br><br>
        <a href="${link}">${link}</a><br><br>
        If you didn't make this request then you can safely ignore this email. :)<br><br>
        &mdash; ePlanet Team
      `;
      return sendMail({
        toEmail: email,
        subject: "ePlanet - Password Reset",
        content,
      });
    })
    .then(([response]) =>
      response
        ? res
            .status(response.statusCode)
            .json({ status: response.statusCode === 202 ? 201 : 500 })
            .end()
        : null
    )
    .catch(next);

export const show = ({ params: { token } }, res, next) =>
  PasswordReset.findOne({ token })
    .populate("user")
    .then(notFound(res))
    .then((reset) => (reset ? reset.view(true) : null))
    .then(success(res))
    .catch(next);

export const update = (
  {
    params: { token },
    bodymen: {
      body: { password },
    },
  },
  res,
  next
) => {
  return PasswordReset.findOne({ token })
    .populate("user")
    .then(notFound(res))
    .then((reset) => {
      if (!reset) return null;
      const { user } = reset;
      return user
        .set({ password })
        .save()
        .then(() => PasswordReset.deleteMany({ user }))
        .then(() => user.view(true));
    })
    .then(success(res))
    .catch(next);
};
