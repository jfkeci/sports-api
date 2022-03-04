import SportModel from '@/resources/sport/sport.model'
import Sport from '@/resources/sport/sport.interface'

class SportService {
    private sport = SportModel;

    /**
     * Create a new sport
     * 
     */
    public async createSport(name: string): Promise<Sport | Error> {
        try {
            const sport = await this.sport.create({ name: name });

            return sport;
        } catch (error) {
            throw new Error('Unable to create a new sport');
        }
    }

    /**
     * Get all sports
     * 
     */
    public async getSports(): Promise<Array<Sport> | Error> {
        try {
            const sports = await this.sport.find({});

            if (!sports) throw new Error('No sport found');

            return sports;
        } catch (error) {
            throw new Error('Something went wrong');
        }
    }

    /**
     * Get sport by id
     * 
     */
    public async getSport(
        id: string,
    ): Promise<Sport | Error> {
        try {
            const sport = await this.sport.findOne({ _id: id });

            if (!sport) throw new Error('No sport found');

            return sport;
        } catch (error) {
            throw new Error('Something went wrong');
        }
    }
}

export default SportService;