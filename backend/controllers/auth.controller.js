const User = require("../models/auth.model");
const expressJwt = require("express-jwt");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");

const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");

//custom error handler to get useful database errors
const { errorHandler } = require("../helpers/dbErrorHandling");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.MAIL_KEY);

exports.registerController = (req, res) => {
  const {
    first_name,
    middle_name,
    last_name,
    address,
    number,
    email,
    password,
  } = req.body;
  const errors = validationResult(req);

  //custom validations
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    User.findOne({
      email,
    }).exec((err, user) => {
      //if user exists
      if (user) {
        return res.status(400).json({
          errors: "Email is taken",
        });
      } else {
        //generate token
        const token = jwt.sign(
          {
            first_name,
            middle_name,
            last_name,
            address,
            number,
            email,
            password,
          },
          process.env.JWT_ACCOUNT_ACTIVATION,
          {
            expiresIn: "15m",
          }
        );
        //email data sending
        const emailData = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: "Account activation link",
          html: `
                        <h1>Please use the following to activate your account</h1>
                        <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
                        <hr />
                        <p>This email may containe sensetive information</p>
                        <p>${process.env.CLIENT_URL}</p>
                    `,
        };
        sgMail
          .send(emailData)
          .then((sent) => {
            return res.json({
              message: `Email has been sent to ${email}`,
            });
          })
          .catch((err) => {
            return res.status(400).json({
              success: false,
              errors: errorHandler(err),
            });
          });
      }
    });
  }
};

//Activation and save to database
exports.activationController = (req, res) => {
  const { token } = req.body;

  if (token) {
    //verify the token is valid or not or expired
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
      if (err) {
        console.log("Activation error");
        return res.status(401).json({
          errors: "Expired link. Register again",
        });
      } else {
        //if valid save to database
        //get user details from token
        const {
          first_name,
          middle_name,
          last_name,
          address,
          number,
          email,
          password,
        } = jwt.decode(token);

        console.log(
          first_name,
          middle_name,
          last_name,
          address,
          number,
          email,
          password
        );
        const user = new User({
          first_name,
          middle_name,
          last_name,
          address,
          number,
          email,
          password,
        });

        user.save((err, user) => {
          if (err) {
            console.log(err);
            console.log("Save error", errorHandler(err));
            return res.status(401).json({
              errors: errorHandler(err),
            });
          } else {
            return res.json({
              success: true,
              message: user,
              message: "Registration success",
            });
          }
        });
      }
    });
  } else {
    return res.json({
      message: "error happening please try again",
    });
  }
};

exports.loginController = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    // check if user exist
    User.findOne({
      email,
    }).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          errors: "User with that email does not exist. Please register",
        });
      }
      // authenticate
      if (!user.authenticate(password)) {
        return res.status(400).json({
          errors: "Email and password do not match",
        });
      }
      // generate a token and send to client
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d", //token valid in 7 day you can set remember me in front and set it to 30d
        }
      );
      const {
        _id,
        first_name,
        middle_name,
        last_name,
        address,
        number,
        email,
        role,
      } = user;

      return res.json({
        token,
        user: {
          _id,
          first_name,
          middle_name,
          last_name,
          address,
          number,
          email,
          role,
        },
      });
    });
  }
};

exports.forgetController = (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);

  //custom validation
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    //find if user exists
    User.findOne(
      {
        email,
      },
      (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: "User with that email does not exist",
          });
        } else {
          //if user exists
          //generate token with that user id
          const token = jwt.sign(
            {
              _id: user._id,
            },
            process.env.JWT_RESET_PASSWORD,
            {
              expiresIn: "10m",
            }
          );
          //send email with this token to reset password
          const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Password Reset link`,
            html: `
                      <h1>Please use the following link to reset your password</h1>
                      <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
                      <hr />
                      <p>This email may contain sensetive information</p>
                      <p>${process.env.CLIENT_URL}</p>
                  `,
          };

          return user.updateOne(
            {
              resetPasswordLink: token,
            },
            (err, success) => {
              if (err) {
                console.log("RESET PASSWORD LINK ERROR", err);
                return res.status(400).json({
                  error:
                    "Database connection error on user password forgot request",
                });
              } else {
                sgMail
                  .send(emailData)
                  .then((sent) => {
                    // console.log('SIGNUP EMAIL SENT', sent)
                    return res.json({
                      message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
                    });
                  })
                  .catch((err) => {
                    // console.log('SIGNUP EMAIL SENT ERROR', err)
                    return res.json({
                      message: err.message,
                    });
                  });
              }
            }
          );
        }
      }
    );
  }
};

exports.resetPasswordController = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    if (resetPasswordLink) {
      jwt.verify(
        resetPasswordLink,
        process.env.JWT_RESET_PASSWORD,
        function (err, decoded) {
          if (err) {
            return res.status(400).json({
              error: "Expired link. Try again",
            });
          }

          User.findOne(
            {
              resetPasswordLink,
            },
            (err, user) => {
              if (err || !user) {
                return res.status(400).json({
                  error: "Something went wrong. Try later",
                });
              }

              const updatedFields = {
                password: newPassword,
                resetPasswordLink: "",
              };

              user = _.extend(user, updatedFields);

              user.save((err, result) => {
                if (err) {
                  return res.status(400).json({
                    error: "Error resetting user password",
                  });
                }
                res.json({
                  message: `Great! Now you can login with your new password`,
                });
              });
            }
          );
        }
      );
    }
  }
};

exports.updateProfileDetailsController = (req, res) => {
  User.updateOne(
    { email: req.body.email },
    { $set: req.body, $currentDate: { lastModified: true } }
  )
    .then((sent) => {
      return res.json({
        data: req.body,
        message: `Your profile has been sucessfully updated`,
      });
    })
    .catch((err) => res.status(400).json("Error: " + err));
};
