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
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRoleEnum } from '../user/enums/user.enum';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles(UserRoleEnum.SUPERADMIN)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Permissions('roles.findAll')
  @Get('/find-all')
  findAll(@Query() query: FindRoleQueryDto) {
    return this.rolesService.findAll(query);
  }
  @Permissions('roles.findAllRole')
  @Get('/find-all-role')
  findAllRole() {
    return this.rolesService.findAllRole();
  }
  @Permissions('roles.findOne')
  @Get('/find')
  findOne(@Query() query: FindRoleQueryDto) {
    return this.rolesService.findOne(query);
  }
  @Permissions('roles.create')
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }
  @Permissions('roles.updateRolePer')
  @Patch('/role-per/:id')
  updateRolePer(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.rolesService.updateRolePer(id, data);
  }
  @Permissions('roles.update')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateUserDto);
  }
  @Permissions('roles.remove')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }
}
