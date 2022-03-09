import SportsClassModel from '@/resources/sportsClass/sportsClass.model'
import SportsClass from '@/resources/sportsClass/sportsClass.interface'

class SportsClassService {
    private sportsClass = SportsClassModel;

    /**
     * Create a new sports class
     * 
     */
    public async createSportsClass(
        title: string,
        description: string,
        sport: string,
        ageLevel: string,
        weekSchedule: Array<object>,
        classStart: Date,
        classDuration: number,
        createdBy: string,
    ): Promise<SportsClass | null> {
        const sportsClass = await this.sportsClass.create({
            title: title,
            description: description,
            sport: sport,
            ageLevel: ageLevel,
            weekSchedule: weekSchedule,
            classStart: classStart,
            classDuration: classDuration,
            createdBy: createdBy
        });

        return sportsClass;
    }

    /**
     * Get all sports classes
     * 
     */
    public async getSportsClasses(
        name?: string,
        age?: string
    ): Promise<Array<SportsClass>> {
        let query = {};

        if (name) query = { name: name };
        if (age) query = { name: name };
        if (age && name) query = {
            name: name,
            age: age
        };

        const sportsClasses = await this.sportsClass.find(query);

        return sportsClasses;
    }

    /**
     * Get sports class by id
     */
    public async getSportsClass(_id: string): Promise<SportsClass | null> {
        const sportsClass = await this.sportsClass.findOne({ _id });

        return sportsClass;
    }

    public async deleteSportsClass(_id: string): Promise<SportsClass | null> {
        const sportsClass = await this.sportsClass.findByIdAndRemove(_id);

        return sportsClass;
    }

    public async updateSportsClass(
        _id: string,
        sportsClass: object
    ): Promise<SportsClass | null> {
        const updatedSportsClass = await this.sportsClass.findByIdAndUpdate(
            _id,
            sportsClass
        );

        console.log(updatedSportsClass)

        return updatedSportsClass;
    }
}

export default SportsClassService;