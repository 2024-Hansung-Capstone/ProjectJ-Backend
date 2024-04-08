import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Point } from './entity/point.entity';
import { PointService } from './point.service';
@Resolver('Point')
export class PointResolver {
  constructor(private readonly pointService: PointService) {}
  @Mutation(() => Point)
  async increasePoint(
    @Args('id') id: string,
    @Args('additionalPoint') additionalPoint: number,
  ): Promise<Point> {
    return await this.pointService.increasePoint(id, additionalPoint);
  }

  @Mutation(() => Boolean)
  async checkAttendance(@Args('id') id: string): Promise<boolean> {
    return await this.pointService.checkAttendance(id);
  }
}
