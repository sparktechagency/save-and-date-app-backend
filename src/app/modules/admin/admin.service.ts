import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { USER_ROLES } from '../../../enums/user';
import { Package } from '../package/package.model';
import { Reservation } from '../reservation/reservation.model';
import { Subscription } from '../subscription/subscription.model';

const createAdminToDB = async (payload: IUser): Promise<IUser> => {
    payload.role = USER_ROLES.ADMIN;
    const createAdmin: any = await User.create(payload);
    if (!createAdmin) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Admin');
    }
    if (createAdmin) {
        await User.findByIdAndUpdate(
            { _id: createAdmin?._id },
            { verified: true },
            { new: true }
        );
    }
    return createAdmin;
};

const deleteAdminFromDB = async (id: any): Promise<IUser | undefined> => {
    const isExistAdmin = await User.findByIdAndDelete(id);
    if (!isExistAdmin) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete Admin');
    }
    return;
};

const getAdminFromDB = async (): Promise<IUser[]> => {
    const admins = await User.find({ role: 'ADMIN' })
        .select('name email profile contact location');
    return admins;
};

const summaryFromDB = async (): Promise<{
    customers: number,
    vendors: number,
    packages: number,
    revenues: number,
    subscribers: number,
    incomes: number
}> => {
    const [customers, vendors, packages, revenuesAgg, subscribers, incomesAgg] = await Promise.all([
        User.countDocuments({ role: 'CUSTOMER' }),
        User.countDocuments({ role: 'VENDOR' }),
        Package.countDocuments(),
        Reservation.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$price' }
                }
            }
        ]),
        User.countDocuments({ isSubscribed: true }),
        Reservation.aggregate([
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: { $multiply: ['$price', 0.9] } }
                }
            }
        ])
    ]);

    const revenues = revenuesAgg[0]?.totalRevenue || 0;
    const incomes = incomesAgg[0]?.totalIncome || 0;

    return { customers, vendors, packages, revenues, subscribers, incomes };
};


const subscriptionStatisticFromDB = async () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const subscriptionStatisticsArray = Array.from({ length: 12 }, (_, i) => ({
        month: monthNames[i],
        total: 0,
    }));

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

    const subscriptionAnalytics = await Subscription.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfYear, $lt: endOfYear }
            }
        },
        {
            $group: {
                _id: { month: { $month: "$createdAt" } },
                total: { $sum: 1 }
            }
        }
    ]);

    // Populate statistics array
    subscriptionAnalytics.forEach(stat => {
        const monthIndex = stat._id.month - 1;
        subscriptionStatisticsArray[monthIndex].total = stat.total;
    });

    return subscriptionStatisticsArray;
};

const userStatisticsFromDB = async () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Initialize user statistics array with 0 counts
    const userStatisticsArray = Array.from({ length: 12 }, (_, i) => ({
        month: monthNames[i],
        customers: 0,
        vendors: 0,
    }));

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

    const usersAnalytics = await User.aggregate([
        {
            $match: {
                role: { $in: ["CUSTOMER", "VENDOR"] },
                createdAt: { $gte: startOfYear, $lt: endOfYear }
            }
        },
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    role: "$role",
                },
                total: { $sum: 1 }
            }
        }
    ]);

    // Populate statistics array
    usersAnalytics.forEach(stat => {
        const monthIndex = stat._id.month - 1;
        if (stat._id.role === "CUSTOMER") {
            userStatisticsArray[monthIndex].customers = stat.total;
        } else if (stat._id.role === "VENDOR") {
            userStatisticsArray[monthIndex].vendors = stat.total;
        }
    });

    return userStatisticsArray;
};

const revenueStatisticsFromDB = async () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Initialize user statistics array with 0 counts
    const revenueStatisticsArray = Array.from({ length: 12 }, (_, i) => ({
        month: monthNames[i],
        revenue: 0,
    }));

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

    const revenueAnalytics = await Reservation.aggregate([
        {
            $match: {
                status: "Completed",
                createdAt: { $gte: startOfYear, $lt: endOfYear }
            }
        },
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    role: "$role",
                },
                total: { $sum: "$price" }
            }
        }
    ]);

    // Populate statistics array
    revenueAnalytics.forEach(stat => {
        const monthIndex = stat._id.month - 1;
        revenueStatisticsArray[monthIndex].revenue = stat.total;
    });

    return revenueStatisticsArray;
};



export const AdminService = {
    createAdminToDB,
    deleteAdminFromDB,
    getAdminFromDB,
    summaryFromDB,
    subscriptionStatisticFromDB,
    userStatisticsFromDB,
    revenueStatisticsFromDB
};
