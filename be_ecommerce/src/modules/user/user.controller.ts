import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserQueryDto } from './dto/find-user-query.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Public } from '../../common/decorators/public.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('user')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Permissions('user.findAll')
  @Get('/find-all')
  findAll(@Query() query: FindUserQueryDto) {
    return this.userService.findAll(query);
  }

  @Get('/find')
  findOne(@Query() query: FindUserQueryDto) {
    return this.userService.findOne(query);
  }

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
  @Get('users/:id/permissions')
  getUserPermissions(@Param('id') id: string) {
    return this.userService.getUserPermissions(id);
  }
  @Patch('users/:id/permissions')
  async updateUserPermissions(
    @Param('id') id: string,
    @Body() body: { permissionIds: number[] },
  ) {
    return this.userService.updateUserPermissions(id, body.permissionIds);
  }
}
