import SportModel from '@/resources/sport/sport.model'
import Sport from '@/resources/sport/sport.interface'

class SportService {
    private sport = SportModel;

    /**
     * Create a new sport
     * 
     */
    public async createSport(name: string): Promise<Sport | null> {
        const sport = await this.sport.create({ name: name });

        return sport;
    }

    /**
     * Get all sports
     * 
     */
    public async getSports(): Promise<Array<Sport>> {
        const sports = await this.sport.find({});

        return sports;
    }

    /**
     * Get sport by id
     * 
     */
    public async getSport(_id: string): Promise<Sport | null> {
        const sport = await this.sport.findOne({ _id });

        return sport;
    }

    public async updateSport(_id: string, sport: object): Promise<Sport | null> {
        let updatedSport = await this.sport.findByIdAndUpdate(_id, sport);

        return updatedSport;
    }

    public async deleteSport(_id: string): Promise<Sport | null> {
        const sport = await this.sport.remove({ _id });

        return sport;
    }

}

export default SportService;