import RatingModel from '@/resources/rating/rating.model'
import Rating from '@/resources/rating/rating.interface'

class RatingService {
    private rating = RatingModel;

    /**
     * Create a new rating
     */
    public async createRating(
        text: string,
        rating: number,
        userId: string,
        classId: string,
    ): Promise<Rating | null> {
        const newRating = await this.rating.create({
            text: text,
            rating: rating,
            userId: userId,
            classId: classId
        });

        return newRating;
    }

    /**
     * Get all ratings
     */
    public async getRatings(): Promise<Array<Rating>> {
        const ratings = await this.rating.find({});

        return ratings;
    }

    /**
     * Get rating by id
     */
    public async getRating(_id: string): Promise<Rating | null> {
        const rating = await this.rating.findOne({ _id });

        return rating;
    }


    /**
     * Get rating by classId
     */
    public async ratingsByClass(classId: string): Promise<Array<Rating> | null> {
        const ratings = await this.rating.find({ classId: classId });

        return ratings;
    }

    /**
     * Get rating by userId
     */
    public async ratingsByUser(userId: string): Promise<Array<Rating> | null> {
        const ratings = await this.rating.find({ userId: userId });

        return ratings;
    }

    /**
     * Delete rating by id
     */
    public async deleteRating(_id: string): Promise<Rating | null> {
        const rating = await this.rating.findByIdAndRemove(_id);

        return rating;
    }

    /**
     * Update rating
     */
    public async updateRating(
        _id: string,
        rating: object
    ): Promise<Rating | null> {
        const updatedRating = await this.rating.findByIdAndUpdate(_id, rating);

        return updatedRating;
    }

    /**
     * Get average rating for class
     */
    public async getAverageRatingForClass(
        classId: string
    ): Promise<Array<object> | null> {
        const res = this.rating.aggregate([
            { $match: { classId: classId } },
            {
                $group: {
                    _id: "$classId",
                    res: { $avg: "$rating" }
                }
            }
        ]);
        return res;
    }
}

export default RatingService;