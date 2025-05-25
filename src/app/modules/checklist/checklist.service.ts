import { FilterQuery } from 'mongoose';
import ApiError from '../../../errors/ApiErrors';
import { IChecklist } from './checklist.interface';
import { Checklist } from './checklist.model';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../../helpers/QueryBuilder';

const createChecklistToDB = async (payload: IChecklist): Promise<IChecklist> => {
    const result = await Checklist.create(payload);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create checklist');
    }
    return result;
}

const retrievedChecklistFromDB = async (user: JwtPayload, query: FilterQuery<any>): Promise<{checklist: IChecklist[], pagination: any}> => {
    const checklistQuery = new QueryBuilder(
        Checklist.find({customer: user.id}), 
        query
    ).paginate();

    const [checklist, pagination] = await Promise.all([
        checklistQuery.queryModel.lean().exec(),
        checklistQuery.getPaginationInfo()
    ]);

    return { checklist, pagination };
}

export const ChecklistService = { createChecklistToDB, retrievedChecklistFromDB };