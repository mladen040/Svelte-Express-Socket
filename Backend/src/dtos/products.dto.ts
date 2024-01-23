import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNumber()
  public userId: number;

  @IsString()
  public userGroup: string;

  @IsString()
  public name: string;

  @IsString()
  public description: string;

  @IsNumber()
  public price: number;
}
