import EnrollmentModel from '@/resources/enrollment/enrollment.model'
import Enrollment from '@/resources/enrollment/enrollment.interface'

class EnrollmentService {
    private enrollment = EnrollmentModel;

    /**
     * Create a new enrollment
     * 
     */
    public async createEnrollment(userId: string, classId: string): Promise<Enrollment | null> {
        const enrollment = await this.enrollment.create({
            userId: userId,
            classId: classId,
        });

        return enrollment;
    }
}

export default EnrollmentService;