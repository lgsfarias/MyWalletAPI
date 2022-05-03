import joi from 'joi';

const userSignUpSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().required(),
});

const userLoginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
});

export { userSignUpSchema, userLoginSchema };
