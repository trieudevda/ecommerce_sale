import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { FindRoleQueryDto } from './dto/find-role-query.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {PermissionsGuard} from "../../common/guards/permissions.guard";
import {Permission} from "../permissions/entities/permission.entity";
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
// @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
// @Roles(UserRoleEnum.SUPERADMIN)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @Permissions('role.find')
  @Get('/find-all')
  findAll(@Query() query: FindRoleQueryDto) {
    return this.rolesService.findAll(query);
  }
  @Get('/find-all-role')
  findAllRole() {
    return this.rolesService.findAllRole();
  }
  @Get('/find')
  findOne(@Query() query: FindRoleQueryDto) {
    return this.rolesService.findOne(query);
  }
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }
  @Patch('/role-per/:id')
  updateRolePer(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.rolesService.updateRolePer(id, data);
  }
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateUserDto);
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }
}
