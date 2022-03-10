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

    public async getEnrollments(): Promise<Array<Enrollment> | null> {
        const enrollments = await this.enrollment.find();

        return enrollments;
    }

    public async getEnrollment(_id: string): Promise<Enrollment | null> {
        const enrollment = await this.enrollment.findById({ _id })

        return enrollment;
    }

    public async enrollmentsByUserId(userId: string): Promise<Array<Enrollment> | null> {
        const enrollments = await this.enrollment.find({ userId: userId });

        return enrollments;
    }

    public async enrollmentsByClassId(classId: string): Promise<Array<Enrollment> | null> {
        const enrollments = await this.enrollment.find({ classId: classId });

        return enrollments;
    }

    public async enrollmentByUserClassPair(
        userId: string,
        classId: string
    ): Promise<Enrollment | null> {
        const enrollment = await this.enrollment.find({
            userId: userId,
            classId: classId
        });

        return enrollment[0];
    }

    public async deleteEnrollment(_id: string): Promise<Enrollment | null> {
        const enrollment = await this.enrollment.findByIdAndRemove(_id);

        return enrollment;
    }

    public async updateEnrollment(
        _id: string,
        enrollment: object
    ): Promise<Enrollment | null> {
        const updatedEnrollment = await this.enrollment.findByIdAndUpdate(_id, enrollment);

        return updatedEnrollment;
    }

    public async hasMaxUsers(
        classId: string
    ): Promise<boolean> {
        const count = await this.enrollment.count({ classId: classId });

        return (count >= 10);
    }

    public async hasMaxEnrollments(
        userId: string,
        classId: string
    ): Promise<boolean> {
        const count = await this.enrollment.count({ userId: userId, classId: classId });

        return (count >= 2);
    }
}

export default EnrollmentService;