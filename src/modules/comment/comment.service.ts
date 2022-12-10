import { inject, injectable } from 'inversify';
import { types } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types.js';
import { CommentServiceInterface } from './comment.service.interface.js';
import { Component } from '../../entities/component.type.js';
import { CommentEntity } from './comment.entity.js';
import { MovieServiceInterface } from '../movie/movie.service.interface.js';
import CreateCommentDto from './dto/create-comment.dto.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface
  ) { }

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    await this.movieService.updateMovieRating(dto.movieId, dto.rating);
    await this.movieService.increaseCommentsCount(dto.movieId);
    return comment.populate('user');
  }

  public async findByMovieId(movieId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel.find({ movieId }).populate('user');
  }
}
