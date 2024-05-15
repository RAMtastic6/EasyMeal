import { PartialType } from '@nestjs/mapped-types';
import { CreateDaysopenDto } from './create-daysopen.dto';

export class UpdateDaysopenDto extends PartialType(CreateDaysopenDto) {}
