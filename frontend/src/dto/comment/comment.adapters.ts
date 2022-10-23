import { Comment } from '../../types/types';
import CreateCommentDto from './dto/create-comment.dto';
import CommentResponse from './response/comment.response';

export const adaptToCreateCommentDto = ({comment, rating}: {comment: string, rating: number})
  : CreateCommentDto => ({
  text: comment,
  publishDate: new Date(),
  rating,
  userId: '',
  offerId: ''
});

export const adaptFromCommentResponse = ({rating, publishDate, text, user}: CommentResponse)
  : Comment => ({
  id: '',
  comment: text,
  rating,
  date: publishDate.toISOString(),
  user
});
