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
    public async getSportsClasses(): Promise<Array<SportsClass>> {
        const sportsClasses = await this.sportsClass.find({});

        return sportsClasses;
    }
}

export default SportsClassService;