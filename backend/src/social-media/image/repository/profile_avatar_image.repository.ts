import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PROVIDER } from "src/common/constants/provider.constant";
import { ProfileAvatarImageEntity } from "src/common/models/entity/profile_avatar";
import { Profile } from "src/social-media/profile/model/profile.model";
import { ProfileAvatarImage } from "../model/profile_avatar_image.model";

@Injectable()
export class ProfileAvatarImageRepository {
    constructor(
        @Inject(PROVIDER.ProfileAvatarImage) private profileAvatarImageRepository: typeof ProfileAvatarImage
    ) { };

    async createUpdateProfileAvatarImage(profile_id: number, link: string): Promise<string> {
        try {
            const queryDataCheck = await this.profileAvatarImageRepository.findOne({
                include: [
                    {
                        model: Profile,
                        where: { profile_id: profile_id, link: link },
                        attributes: [],
                    }
                ]
            });

            var profileAvatarImage = new ProfileAvatarImageEntity();
            profileAvatarImage.profile_id = profile_id;
            profileAvatarImage.link = link;

            if (queryDataCheck) {
                queryDataCheck.link = link;
                await queryDataCheck.save();
                const querydata = await this.profileAvatarImageRepository.findOne({
                    where: { profile_avatar_image_id: queryDataCheck.profile_avatar_image_id },
                    raw: true,
                })
                return querydata.link;
            } else {
                const queryCreate = await this.profileAvatarImageRepository.create(profileAvatarImage);
                const querydata = await this.profileAvatarImageRepository.findOne({
                    where: { profile_avatar_image_id: queryCreate.profile_avatar_image_id },
                    raw: true,
                })
                return querydata.link;
            }
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }
}