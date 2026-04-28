import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { TransactionResponseDto } from '../transactions/dto/transaction-response.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../common/decorators/current-user.decorator';

@ApiTags('Customers')
@ApiSecurity('api-key')
@ApiExtraModels(CustomerResponseDto, TransactionResponseDto)
@UseGuards(ApiKeyGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({
    summary: 'List all customers',
    description:
      "Returns all customers for the authenticated merchant's organization. Supports filtering by search term, customer type, and activity status.",
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by name or email',
    type: String,
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by customer type',
    enum: ['business', 'individual', 'all'],
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description:
      'Filter by activity status (active = has transactions, inactive = no transactions)',
    enum: ['active', 'inactive', 'all'],
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of items per page',
    type: Number,
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: 'List of customers with pagination',
    schema: {
      properties: {
        customers: {
          type: 'array',
          items: { $ref: getSchemaPath(CustomerResponseDto) },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            pageSize: { type: 'number', example: 50 },
            totalCount: { type: 'number', example: 100 },
            totalPages: { type: 'number', example: 2 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  findAll(
    @CurrentUser() user: AuthContext,
    @Query('search') search?: string,
    @Query('type') type?: 'business' | 'individual' | 'all',
    @Query('status') status?: 'active' | 'inactive' | 'all',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(50), ParseIntPipe)
    pageSize?: number,
  ) {
    return this.customersService.findAll(
      user,
      search,
      type,
      status,
      page,
      pageSize,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get customer by ID',
    description:
      'Returns a single customer. Responds with 404 if the customer does not exist or is not available for this API key.',
  })
  @ApiParam({
    name: 'id',
    description: 'Customer UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Customer details',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found or access denied',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.customersService.findOne(id, user);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new customer',
    description:
      'Creates a new customer in your organization. The customer will be automatically linked to your organization.',
  })
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', example: 'Jane Doe' },
        email: { type: 'string', format: 'email' },
        phone_number: { type: 'string' },
        whatsapp_number: { type: 'string' },
        country: { type: 'string' },
        city: { type: 'string' },
        address: { type: 'string' },
        postal_code: { type: 'string' },
        is_business: { type: 'boolean' },
        metadata: { type: 'object', additionalProperties: true },
      },
    },
    examples: {
      minimal: {
        summary: 'Minimal customer',
        value: {
          name: 'Jane Doe',
          email: 'jane@example.com',
        },
      },
    },
  })
  create(
    @Body() createDto: CreateCustomerDto,
    @CurrentUser() user: AuthContext,
  ) {
    return this.customersService.create(createDto, user);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a customer',
    description:
      'Updates a customer. Send only the fields to change. Responds with 404 if the customer does not exist or is not available for this API key.',
  })
  @ApiParam({
    name: 'id',
    description: 'Customer UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Customer updated successfully',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found or access denied',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        phone_number: { type: 'string' },
        whatsapp_number: { type: 'string' },
        country: { type: 'string' },
        city: { type: 'string' },
        address: { type: 'string' },
        postal_code: { type: 'string' },
        is_business: { type: 'boolean' },
        metadata: { type: 'object', additionalProperties: true },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCustomerDto,
    @CurrentUser() user: AuthContext,
  ) {
    return this.customersService.update(id, updateDto, user);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a customer',
    description:
      'Removes a customer from active use. They will no longer appear in list or get responses. Responds with 404 if the customer does not exist or is not available for this API key.',
  })
  @ApiParam({
    name: 'id',
    description: 'Customer UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Customer deleted successfully',
    schema: {
      properties: {
        message: { type: 'string', example: 'Customer deleted successfully' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found or access denied',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  remove(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.customersService.remove(id, user);
  }

  @Get(':id/transactions')
  @ApiOperation({
    summary: 'Get customer transactions',
    description:
      'Returns transactions for a customer. Responds with 404 if the customer does not exist or is not available for this API key.',
  })
  @ApiParam({
    name: 'id',
    description: 'Customer UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'List of customer transactions',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(TransactionResponseDto) },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found or access denied',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  getTransactions(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.customersService.getTransactions(id, user);
  }
}
