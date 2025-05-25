import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { INote } from './note.interface';
import { Note } from './note.model';
import { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../../helpers/QueryBuilder';
import { FilterQuery } from 'mongoose';


const makeNote = async (payload: INote): Promise<INote> => {
    const note = await Note.create(payload);
    if (!note) {
        throw new ApiError( StatusCodes.BAD_REQUEST, "Failed to create note");
    }
    return note;
}

const retrieveNotesFromDB = async (user: JwtPayload, query: FilterQuery<any>): Promise<{notes: INote[], pagination: any}> => {

    const noteQuery = new QueryBuilder(
        Note.find({ customer: user.id }),
        query
    ).paginate();

    const [notes, pagination] = await Promise.all([
        noteQuery.queryModel.lean().exec(),
        noteQuery.getPaginationInfo()
    ])

    if (!notes) {
        throw new ApiError( StatusCodes.BAD_REQUEST, "Failed to retrieve notes");
    }
    return {notes, pagination};
}

	
export const NoteServices = { makeNote, retrieveNotesFromDB };
