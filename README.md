Introduction

This website allows users to upload food images and get suggestions to change the background to something more appealing. Users can choose to use the suggested background or keep the original image. The final image can then be uploaded to the database and Cloudinary for storage.
Features

    Category Selection: Choose a category for the food item.
    Food Name Suggestions: Get suggestions for food names based on the selected category.
    Image Upload: Upload a food image for processing.
    Background Change Suggestion: Get suggestions for changing the background of the uploaded food image.
    Optional Background Change: Users can choose to use the suggested background or keep the original image.
    Image Storage: Store the final image in the database and Cloudinary.

Technologies Used

    Frontend:
        Next.js
        React
        Formik
        Yup
        Tailwind CSS

    Backend:
        Node.js
        PostgreSql
        Neon.Tech
        Axios

    Third-Party APIs:
        Eden AI (for background removal)
        Cloudinary (for image storage)

Installation
Prerequisites

    Node.js (>= 14.x)
    npm or yarn

Steps

    Clone the repository:

bash

git clone https://github.com/nurrizkiamalia/deili-project.git
cd food-image-background-suggestion

    Install the dependencies:

bash

npm install
# or
yarn install

    Create a .env.local file in the root directory and add the necessary environment variables (see Environment Variables).

    Run the development server:

bash

npm run dev
# or
yarn dev

Usage

    Open your browser and navigate to the vercel link.

    Select a category for the food item.

    Enter the name of the food item or get suggestions by clicking on "Get Suggestions."

    Upload a food image.

    Get background change suggestions and choose whether to use the suggested background or keep the original.

    Submit the form to store the final image in the database and Cloudinary.


    GET /api/categories: Fetches the list of categories.
    GET /api/products: Fetches the list of products.
    POST /api/products: Adds a new product to the database.
    PUT /api/products/:id: Updates an existing product in the database.
    DELETE /api/products/:id: Deletes a product from the database.
