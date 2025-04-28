import { StatusCodes } from 'http-status-codes';
import userRepo from '../repositories/userRepository.js';
import { validationResult } from 'express-validator';
import { logger } from '../middleware/logger.js';

// @desc    Register a new user
// @route   POST /api/user
// @access  Public
export const registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    const {
        firstname, lastname, email, password,
        address, contactNumber, pic = `https://avatar.iran.liara.run/username?username=${firstname}`
    } = req.body;

    try {
        const isUserExist = await userRepo.findByEmail(email);
        if (isUserExist) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User already exists' });
        }

        const user = await userRepo.createUser({
            firstname, lastname, email, password,
            address, contactNumber, pic
        });

        return res.status(StatusCodes.CREATED).json({
            message: 'User created',
            user: {
                userId: user.userId,
                email: user.email
            }
        });
    } catch (error) {
        return next(error);
    }
};

export const getUserProfile = async (req, res, next) => {
    try {
        const user = await userRepo.findById(req.userId);
        if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });

        const { password, address, mobileNumbers, ...baseUser } = user.dataValues;

        const cleanedAddress = address
            ? {
                street: address.street,
                city: address.city,
                postalCode: address.postalCode,
                country: address.country
            }
            : null;

        const cleanedMobileNumbers = Array.isArray(mobileNumbers)
            ? mobileNumbers.map(({ number }) => ({ number }))
            : [];

        res.json({
            user: {
                ...baseUser,
                address: cleanedAddress,
                mobileNumbers: cleanedMobileNumbers
            },
            links: {
                self: { href: '/user/me', method: 'GET' }
            }
        });
    } catch (error) {
        return next(error);
    }
};


// @desc    update user
// @route   PUT /api/v1/user
// @access  Private
export const updateUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    try {
        const user = await userRepo.findById(req.userId);
        if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });

        const {
            firstname, lastname, email, password,
            defaultAddress, contactNumber, pic, birthday
        } = req.body;

        logger.info(req.body)

        user.firstname = firstname || user.firstname;
        user.lastname = lastname || user.lastname;
        user.email = email || user.email;
        if (password) user.password = password; // Only update if password is provided
        user.defaultAddress = defaultAddress || user.defaultAddress;
        user.contactNumber = contactNumber || user.contactNumber;
        user.pic = pic || user.pic;
        user.birthday = birthday || user.birthday;

        logger.info(user.firstname);

        const updatedUser = await userRepo.updateUser(user);

        return res.status(StatusCodes.OK).json({
            message: 'User updated successfully',
            userId: updatedUser.userId
        });

    } catch (error) {
        return next(error);
    }
};

export const deleteUserAccount = async (req, res, next) => {
    try {
        const user = await userRepo.findById(req.userId);
        if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });

        await userRepo.deleteById(user.userId);
        res.status(StatusCodes.OK).json({ message: 'User account deleted successfully' });
    } catch (error) {
        return next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const user = await userRepo.findById(req.params.id);
        if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });

        const { password, ...userInfo } = user.dataValues;
        res.json(userInfo);
    } catch (error) {
        return next(error);
    }
};
