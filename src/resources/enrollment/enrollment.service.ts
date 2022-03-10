import EnrollmentModel from '@/resources/enrollment/enrollment.model'
import Enrollment from '@/resources/enrollment/enrollment.interface'

class EnrollmentService {
    private enrollment = EnrollmentModel;

    /**
     * Create a new enrollment
     */
    public async createEnrollment(userId: string, classId: string): Promise<Enrollment | null> {
        const enrollment = await this.enrollment.create({
            userId: userId,
            classId: classId,
        });

        return enrollment;
    }

    /**
     * Get all enrollments
     */
    public async getEnrollments(): Promise<Array<Enrollment> | null> {
        const enrollments = await this.enrollment.find();

        return enrollments;
    }

    /**
     * Get single enrollment by id
     */
    public async getEnrollment(_id: string): Promise<Enrollment | null> {
        const enrollment = await this.enrollment.findById({ _id })

        return enrollment;
    }

    /**
     * Get enrollments by user
     */
    public async enrollmentsByUserId(userId: string): Promise<Array<Enrollment> | null> {
        const enrollments = await this.enrollment.find({ userId: userId });

        return enrollments;
    }

    /**
     * Get enrollments by class
     */
    public async enrollmentsByClassId(classId: string): Promise<Array<Enrollment> | null> {
        const enrollments = await this.enrollment.find({ classId: classId });

        return enrollments;
    }

    /**
     * Get enrollment by user and class pair
     */
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

    /**
     * Delete enrollment by id
     */
    public async deleteEnrollment(_id: string): Promise<Enrollment | null> {
        const enrollment = await this.enrollment.findByIdAndRemove(_id);

        return enrollment;
    }

    /**
     * Update enrollment
     */
    public async updateEnrollment(
        _id: string,
        enrollment: object
    ): Promise<Enrollment | null> {
        const updatedEnrollment = await this.enrollment.findByIdAndUpdate(_id, enrollment);

        return updatedEnrollment;
    }

    /**
     * Check if class has max amount of users enrolled
     */
    public async hasMaxUsers(
        classId: string
    ): Promise<boolean> {
        const count = await this.enrollment.count({ classId: classId });

        return (count >= 10);
    }

    /**
     * Check if user has max enrollments for class
     */
    public async hasMaxEnrollments(
        userId: string,
        classId: string
    ): Promise<boolean> {
        const count = await this.enrollment.count({ userId: userId, classId: classId });

        return (count >= 2);
    }

    public async userEnrolledInClass(
        userId: string,
        classId: string
    ): Promise<boolean> {
        const enrollment = await this.enrollment.find({ userId: userId, classId: classId });

        if (!enrollment) return false;

        return true;
    }
}

export default EnrollmentService;