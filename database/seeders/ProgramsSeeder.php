<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Programs;

class ProgramsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //

        $programs = [
            [
                'cover_image' =>
                'program_name' => 'Farmer Training & Workshops',
                'program_description' => 'The Farmer Training & Workshops program is designed to equip farmers with the knowledge, skills, and resources they need to enhance their agricultural practices and improve productivity. Through a series of hands-on workshops, expert-led training sessions, and practical demonstrations, participants learn about the latest farming techniques, sustainable practices, crop management, and effective use of technology. The program emphasizes the importance of soil health, water conservation, pest management, and climate-resilient farming practices, helping farmers adapt to the changing environment while maintaining profitability.

In addition to technical training, the program also focuses on building strong farming communities by fostering collaboration and knowledge exchange among participants. Networking opportunities with industry professionals, agricultural experts, and fellow farmers allow participants to share their experiences and learn from one another. The workshops cover various topics such as organic farming, advanced irrigation systems, livestock management, and farm business development, giving farmers the tools they need to succeed. By providing continuous support and access to valuable resources, the program aims to create a sustainable and thriving agricultural community for the future.',
                'program_objectives' => '[
  {
    "objective": "Enhance Agricultural Knowledge",
   
  },
  {
    "objective": "Promote Sustainable Practices",
   
  },
  {
    "objective": "Improve Farm Productivity",
   
  },
  {
    "objective": "Encourage Climate Resilient Farming",
   
  },
  {
    "objective": "Facilitate Knowledge Sharing",
   
  },
  {
    "objective": "Support Farm Business Development",
    
  },
  {
    "objective": "Promote Networking with Industry Experts",
   
  }
]
',
                'program_timeline' => '[
  {
    "activity": "Recruitment of participants",
    "date": "2024-11-19T00:00:00"
  },
  {
    "activity": "Survey to understand the needs and interests of farmers",
    "date": "2024-11-19T00:00:00"
  },
  {
    "activity": "Development of training materials and schedules",
    "date": "2024-11-19T00:00:00"
  },
  {
    "activity": "Coordination with trainers and experts",
    "date": "2024-11-19T00:00:00"
  },
  {
    "activity": "Welcome session and program overview",
    "date": "2025-01-06T00:00:00"
  },
  {
    "activity": "Introduction to the program objectives and expected outcomes",
    "date": "2025-01-06T00:00:00"
  },
  {
    "activity": "Meet and greet with trainers and fellow participants",
    "date": "2025-01-06T00:00:00"
  },
  {
    "activity": "Initial assessment of participant skills and knowledge",
    "date": "2025-01-06T00:00:00"
  },
  {
    "activity": "Hands-on workshops on sustainable farming practices",
    "date": "2025-01-13T00:00:00"
  },
  {
    "activity": "Training on crop management, irrigation, and soil health",
    "date": "2025-01-13T00:00:00"
  },
  {
    "activity": "Workshops on pest management and organic farming",
    "date": "2025-01-13T00:00:00"
  },
  {
    "activity": "Advanced livestock management and farm business development sessions",
    "date": "2025-01-13T00:00:00"
  },
  {
    "activity": "On-site visits to farms with successful practices",
    "date": "2025-02-10T00:00:00"
  },
  {
    "activity": "Real-life demonstrations of irrigation systems, crop rotation, and pest control methods",
    "date": "2025-02-10T00:00:00"
  },
  {
    "activity": "Practical application of knowledge gained in previous sessions",
    "date": "2025-02-10T00:00:00"
  },
  {
    "activity": "Networking events with agricultural experts, professionals, and service providers",
    "date": "2025-02-17T00:00:00"
  },
  {
    "activity": "Group discussions and knowledge-sharing sessions among farmers",
    "date": "2025-02-17T00:00:00"
  },
  {
    "activity": "Building connections with local agricultural communities",
    "date": "2025-02-17T00:00:00"
  },
  {
    "activity": "Final assessment of participant skills and knowledge",
    "date": "2025-02-24T00:00:00"
  },
  {
    "activity": "Evaluation of program outcomes and feedback collection",
    "date": "2025-02-24T00:00:00"
  },
  {
    "activity": "Certification of completion for successful participants",
    "date": "2025-02-24T00:00:00"
  },
  {
    "activity": "Discussion on post-program support and resources available",
    "date": "2025-02-24T00:00:00"
  },
  {
    "activity": "Follow-up sessions to address challenges faced by farmers",
    "date": "2025-05-24T00:00:00"
  },
  {
    "activity": "Access to a support network for continued learning and assistance",
    "date": "2025-05-24T00:00:00"
  },
  {
    "activity": "Periodic workshops and refresher courses",
    "date": "2025-05-24T00:00:00"
  }
]
',
                'program_eligibility' => 'Farmer',
                'admin_id' => 2,
            ],
        ];

        foreach ($programs as $program) {
            Programs::create([
                'cover_image' => $program['cover_image'],
                'program_name' => $program['program_name'],
                'program_description' => $program['program_description'],
                'program_objectives' => json_encode(
                    $program['program_objectives']
                ),
                'program_timeline' => json_encode($program['program_timeline']),
                'program_eligibility' => $program['program_eligibility'],
                'admin_id' => $program['admin_id'],
            ]);
        }
    }
}