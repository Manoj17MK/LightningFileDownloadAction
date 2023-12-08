# Download Files Quick Action Lightning Component

## Overview

The DownloadFilesQuickAction Lightning component is designed to serve as a quick action within Salesforce Lightning Experience. This component enables users to initiate a file download process associated with a record. It displays a loading message and a spinner while awaiting the completion of the download process.

**Owner:** Dheeraj Sharma

## Prerequisites

Before using this component, make sure you have the JSZip library uploaded as a static resource in your Salesforce org.

### JSZip Library

- **Link:** [JSZip Library](https://cdnjs.com/libraries/jszip)
  
### Steps to Upload JSZip as a Static Resource

1. Log in to your Salesforce org.

2. Navigate to Setup.

3. In the Quick Find box, type "Static Resources."

4. Click on "Static Resources."

5. Click "New Static Resource."

6. Fill in the following details:
   - **Name:** JSZip2
   - **Cache Control:** Public
   - **Content Type:** application/zip
   - **Upload .zip File:** Choose the JSZip library file (e.g., jszip.js) you downloaded.

7. Click "Save."

## Usage

1. Add the "Download Files Quick Action" Lightning component to the desired Lightning page or record page.

2. Make sure the necessary JSZip library is included as a static resource.

3. When the quick action is triggered, it will display a loading message and a spinner while waiting for the file download process to complete.

## Use it, Have Fun with it, Enhance it!

Feel free to use this Lightning component in your Salesforce org, experiment with it, and enhance its functionality based on your requirements. This component is a starting point, and you are encouraged to customize and extend it as needed.

### Suggestions for Enhancement

- Add additional features to improve user experience.
- Optimize governor limits.
- Implement error handling for different scenarios.
- Integrate with other Salesforce features or third-party libraries.

---

**Disclaimer:** This component is provided as-is and may require adjustments based on your specific Salesforce org configuration.
