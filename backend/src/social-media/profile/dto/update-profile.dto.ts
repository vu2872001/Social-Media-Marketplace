import { IsEmail, IsNotEmpty, IsString, Matches, Min, Max, MaxLength, MinLength, IsNumber } from "class-validator";

export class UpdateProfileDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(30)
    username: string;

    @IsNotEmpty()
    @IsString()
    old_hash_password: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password is to weak'})
    new_password: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(10)
    @Max(110)
    age: number; 
    
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
}