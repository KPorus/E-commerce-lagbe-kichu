import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerGuard } from 'src/auth/guard/seller.guard';
// import { ManagerGuard } from 'src/auth/guard/manager.guard';
import { CreateProductDto, CreateUserDto } from './dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
// import { InventoryGuard } from 'src/auth/guard/inventory.guard';
import { CombinGuard } from 'src/auth/guard/combin.guard';
import { GetUser } from 'src/auth/decorator';
import { Types } from 'mongoose';
import { CombinTwoGuard } from 'src/auth/guard/combinTwo.guard';

@Controller('seller')
export class SellerController {
  constructor(
    private sellerService: SellerService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // Add a new product ===============================
  @Post('/upload-product')
  @UseGuards(CombinGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 10 },
      { name: 'video', maxCount: 2 },
    ]),
  )
  async createProduct(
    @UploadedFiles()
    files: { images?: Express.Multer.File[]; video?: Express.Multer.File[] },
    @Body() body: CreateProductDto,
    @GetUser() user,
  ) {
    console.log('Images:', files.images);
    console.log('Video:', files.video);

    const owner = new Types.ObjectId(user.created_by || user._id);

    const existingProduct = await this.sellerService.getProductByTitle(
      body.title,
    );
    if (existingProduct) {
      throw new BadRequestException(
        'Product with the same title already exists',
      );
    }

    const imageFiles = files.images || [];
    const videoFiles = files.video || [];

    const imageUploadPromises = imageFiles.map((file) =>
      this.cloudinaryService.uploadImage(file),
    );
    const uploadedImages = await Promise.all(imageUploadPromises);
    const imageUrls = uploadedImages.map((img) => img.secure_url);

    let videoUrl = '';
    if (videoFiles.length > 0) {
      const video = videoFiles[0];
      videoUrl = await this.cloudinaryService.uploadVideo(video);
    }

    let discountEndTime: Date | null = null;
    if (body.specialDiscount && body.discountDurationInDays) {
      const now = new Date();
      discountEndTime = new Date(
        now.getTime() + body.discountDurationInDays * 24 * 60 * 60 * 1000,
      );
    }

    const productData = {
      ...body,
      Owner: owner,
      images: imageUrls,
      previewVideo: videoUrl,
      discountEndTime,
    };

    return this.sellerService.addProduct(productData);
  }

  // Edit a product ===============================
  @UseGuards(CombinGuard)
  @Put('/update-product/:id')
  @UseInterceptors(FilesInterceptor('images', 5))
  async updateProduct(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateProductDto,
  ) {
    const existingProduct = await this.sellerService.getProductByTitle(
      body.title,
    );
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    const imageFiles = files.filter((file) =>
      file.mimetype.startsWith('image'),
    );
    const videoFiles = files.filter((file) =>
      file.mimetype.startsWith('video'),
    );

    let imageUrls: string[] = existingProduct.images || [];
    if (imageFiles.length > 0) {
      const imageUploadPromises = imageFiles.map((file) =>
        this.cloudinaryService.uploadImage(file),
      );
      const uploadedImages = await Promise.all(imageUploadPromises);
      const newImageUrls = uploadedImages.map((img) => img.secure_url);

      imageUrls = [...imageUrls, ...newImageUrls];
    }

    let videoUrl: string = existingProduct.previewVideo || '';
    if (videoFiles.length > 0) {
      const video = videoFiles[0];
      videoUrl = await this.cloudinaryService.uploadVideo(video);
    }

    return this.sellerService.updateProduct(id, {
      ...body,
      images: imageUrls,
      previewVideo: videoUrl,
    });
  }

  // Get all products of a seller ===============================
  @UseGuards(CombinGuard)
  @Get('/get-products')
  getProducts(@GetUser() user: any) {
    const userId = user._id || user.created_by;
    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.sellerService.getProducts(userId);
  }

  // Delete a product by ID ===============================
  @UseGuards(CombinGuard)
  @Delete('/delete-product/:productId')
  deleteProduct(@Param('productId') productId: string) {
    return this.sellerService.deleteProduct(productId);
  }

  // Create a seller employee ===============================
  @Post('/create/')
  @UseGuards(SellerGuard)
  createUsers(@GetUser() user, @Body() dto: CreateUserDto) {
    return this.sellerService.createUsers(dto, user._id);
  }
  // Get Employee
  @Get('/get-employee')
  @UseGuards(SellerGuard)
  getEmployee(@GetUser() user) {
    return this.sellerService.getEmployee(user._id);
  }

  // Get Seller order ================================
  @Get('/get-orders')
  @UseGuards(CombinTwoGuard)
  getOrders(@GetUser() user: any) {
    console.log(user);
    const id = user._id || user.created_by;
    if (!id) {
      throw new BadRequestException('Invalid user ID');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.sellerService.getOrders(id);
  }
  @Patch('/update-orders-status/:id')
  @UseGuards(CombinTwoGuard)
  updateOrdersStatus(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() status: { status: string },
  ) {
    const userId = user._id || user.created_by;
    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.sellerService.updateOrdersStatus(userId, id, status.status);
  }
}
