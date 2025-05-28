import colors from 'colors';
import { User } from '../app/modules/user/user.model';
import config from '../config';
import { USER_ROLES } from '../enums/user';
import { logger } from '../shared/logger';

const superUser = {
    name: 'Meron Yoga',
    role: USER_ROLES.SUPER_ADMIN,
    email: config.admin.email,
    phone: "+6552213543",
    password: config.admin.password,
    verified: true,
};

const seedSuperAdmin = async () => {
    const isExistSuperAdmin = await User.findOne({
        role: USER_ROLES.SUPER_ADMIN,
    });

    if (!isExistSuperAdmin) {
        await User.create(superUser);
        logger.info(colors.green('✔ Super admin created successfully!'));
    }
};

export default seedSuperAdmin;