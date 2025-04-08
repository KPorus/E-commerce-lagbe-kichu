import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
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
import { FilesInterceptor } from '@nestjs/platform-express';
// import { InventoryGuard } from 'src/auth/guard/inventory.guard';
import { CombinGuard } from 'src/auth/guard/combin.guard';

@Controller('seller')
export class SellerController {
  constructor(
    private sellerService: SellerService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('/upload-product')
  @UseGuards(CombinGuard)
  // @UseGuards(InventoryGuard)
  @UseInterceptors(FilesInterceptor('file', 10))
  async createProduct(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateProductDto,
  ) {
    const existingProduct = await this.sellerService.getProductByTitle(
      body.title,
    );
    if (existingProduct) {
      throw new BadRequestException(
        'Product with the same title already exists',
      );
    }

    const imageFiles = files.filter((file) =>
      file.mimetype.startsWith('image'),
    );
    const videoFiles = files.filter((file) =>
      file.mimetype.startsWith('video'),
    );

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

    // console.log('Image URLs:', imageUrls);
    // console.log('Video URL:', videoUrl);

    return this.sellerService.addProduct({
      ...body,
      images: imageUrls,
      previewVideo: videoUrl,
    });
  }

  // Edit a product
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

  // Get all products of a seller
  @UseGuards(CombinGuard)
  @Get('/get-products/:id')
  getProducts(@Param('id') id: string) {
    return this.sellerService.getProducts(id);
  }

  // Delete a product by ID
  @UseGuards(CombinGuard)
  @Delete('/delete-product/:productId')
  deleteProduct(@Param('productId') productId: string) {
    return this.sellerService.deleteProduct(productId);
  }

  @Post('/create/:id')
  @UseGuards(SellerGuard)
  createUsers(@Param('id') id: string, @Body() dto: CreateUserDto) {
    return this.sellerService.createUsers(dto, id);
  }
}
