import { Injectable } from "@nestjs/common";
import { ResponseData } from "src/common/models/view-model/success-message.model";
import { ExceptionResponse } from "src/common/utils/custom-exception.filter";
import { Profile } from "src/social-media/profile/model/profile.model";
import { ProfileAvatarImageRepository } from "../repository/profile_avatar_image.repository";

@Injectable()
export class ProfileAvatarImageService {
    constructor(private readonly profileAvatarImageRepository: ProfileAvatarImageRepository) { };

    async createUpdateProfileAvatarImage(profile_id: number, link: string): Promise< ResponseData<string>> {
        //resolve save to database
        //check update if exist, create if not exist
        try {
            var response = new ResponseData<string>();
            response.results = await this.profileAvatarImageRepository.createUpdateProfileAvatarImage(profile_id, link);
            return response;
        } catch (err) {
            ExceptionResponse(err);
        }
    }
}