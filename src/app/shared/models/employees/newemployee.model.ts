export class Employee {
  public FirstName: string;
  public MiddleName: string;
  public LastName: string;
  public BirthDate: string;
  public Gender: string;
  public BloodGroup: string;
  public Mobile: string;
  public Nationality: string;
  public MaritalStatus: string;
  public PersonalEmail: string;
  public WorkEmail: string;
  public Designation: string;
  public DateOfJoining: string;
  public ProfileImage: string;
  public CurrentAddress: Address;
  public PermanentAddress: Address;
  public FamilyDetails: FamilyDetails[];
  public EmploymentDetails: EmploymentDetails[];
  public AcademicDetails: AcademicDetails[];

  constructor() {
    this.CurrentAddress = new Address();
    this.PermanentAddress = new Address();
    this.FamilyDetails = new Array<FamilyDetails>();
    this.EmploymentDetails = new Array<EmploymentDetails>();
    this.AcademicDetails = new Array<AcademicDetails>();
  }
}

export class Address {
  public FlatNo: string;
  public Area: string;
  public LandMark: string;
  public City: string;
  public State: string;
  public Country: string;
}

export class FamilyDetails {
  public Relationship: string;
  public Name: string;
  public Age: number;
  public Qualification: string;
  public Employer: string;
  public Occupation: string;
}

export class EmploymentDetails {
  public Name: string;
  public PositionHeld: string;
  public Period: any = {};
  public TotalCTC: number;
  public ReasonForLeaving: string;
}

export class AcademicDetails {
  public SchoolORCOllege: string;
  public DiplomaORDegree: string;
  public Period: any = {};
  public BoardORUniversity: string;
  public Percentage: number;
  public CourseType: string;
}
