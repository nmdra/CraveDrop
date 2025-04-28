import { User, Address, MobileNumber } from '../models/index.js';

class UserRepository {
    async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    async findById(userId) {
        return await User.findByPk(userId, {
            include: [
                { model: Address, as: 'address' },
                { model: MobileNumber, as: 'mobileNumbers' }
            ]
        });
    }

    async createUser(data) {
        const {
            firstname, lastname, email, password,
            contactNumber, address, pic
        } = data;

        // Create the user
        const user = await User.create({ firstname, lastname, email, password, pic });

        // Create the address
        if (address) {
            await Address.create({ ...address, userId: user.userId });
        }

        // Create mobile numbers
        if (contactNumber) {
            await MobileNumber.create({ number: contactNumber, userId: user.userId });
        }

        return this.findById(user.userId); // Return full user with associations
    }

    async updateUser(user) {

        // Save the updated user
        await user.save();

        // Update or create the address if provided
        if (user.defaultAddress) {
            const currentAddress = await Address.findOne({ where: { userId: user.userId } });
            if (currentAddress) {
                await currentAddress.update(user.defaultAddress);
            } else {
                await Address.create({ ...user.defaultAddress, userId: user.userId });
            }
        }

        // Update or create the contact number if provided
        if (user.contactNumber) {
            const currentContactNumber = await MobileNumber.findOne({ where: { userId: user.userId } });
            if (currentContactNumber) {
                await currentContactNumber.update({ number: user.contactNumber });
            } else {
                await MobileNumber.create({ number: user.contactNumber, userId: user.userId });
            }
        }

        return this.findById(user.userId); // Return the updated user with associations
    }


    async deleteById(userId) {
        // Delete address and mobile numbers first (foreign key constraints)
        await Address.destroy({ where: { userId } });
        await MobileNumber.destroy({ where: { userId } });
        return await User.destroy({ where: { userId } });
    }
}

export default new UserRepository();
