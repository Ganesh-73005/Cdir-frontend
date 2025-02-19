export interface Building {
    label: string
    confidence: number
    info: {
        Name: string
        "Courses offered": string
        HOD: string
        "No. of Staffs": string
        "No of UG students": string
        "No of PG students": string
        Projects: string
        "Official page": string
        "Students Association": string
        Lat: number
        Long: number
        [key: string]: string | number
    }
}

