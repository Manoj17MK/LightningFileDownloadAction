/**
 * Apex class for downloading files associated with a record.
 * Author: Dheeraj Sharma
 */
public class DownloadController {

    /**
     * @AuraEnabled method to download files associated with a record.
     * @param recordId The ID of the record.
     * @return FileWrapper containing file information.
     */
    @AuraEnabled
    public static FileWrapper fetchDownloadableFiles(Id recordId) {
        try {
            String sObjectName = recordId.getSObjectType().getDescribe().getName();
            String recordName = getRecordName(recordId, sObjectName);
            String fileName = recordName + '_' + sObjectName + '_Files';

            Set<Id> documentIds = getContentDocumentIds(recordId);

            List<ContentVersion> contentVersions = getContentVersions(documentIds);

            List<Content> fileContents = createFileContents(fileName, contentVersions);

            return new FileWrapper(fileName, fileContents);
        } catch (Exception ex) {
            handleException(ex);
            return null;
        }
    }

    /**
     * Method to retrieve the name of the record.
     * @param recordId The ID of the record.
     * @param sObjectName The name of the sObject.
     * @return The name of the record.
     */
    private static String getRecordName(Id recordId, String sObjectName) {
        String query = 'SELECT Id,Name FROM ' + sObjectName + ' WHERE Id =: recordId';
        List<sObject> sObjRecord = Database.query(query);
        return sObjRecord.isEmpty() ? null : String.valueOf(sObjRecord[0].get('Name'));
    }

    /**
     * Method to get ContentDocumentIds linked to the record.
     * @param recordId The ID of the record.
     * @return Set of ContentDocumentIds.
     */
    private static Set<Id> getContentDocumentIds(Id recordId) {
        List<ContentDocumentLink> documentLinks = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :recordId];
        Set<Id> documentIds = new Set<Id>();
        for (ContentDocumentLink link : documentLinks) {
            documentIds.add(link.ContentDocumentId);
        }
        return documentIds;
    }

    /**
     * Method to get ContentVersions based on ContentDocumentIds.
     * @param documentIds Set of ContentDocumentIds.
     * @return List of ContentVersions.
     */
    private static List<ContentVersion> getContentVersions(Set<Id> documentIds) {
        return [SELECT VersionData, Title, FileExtension FROM ContentVersion WHERE ContentDocumentId IN :documentIds];
    }

    /**
     * Method to create fileContents for FileWrapper.
     * @param fileName The name of the file.
     * @param contentVersions List of ContentVersions.
     * @return List of Content objects.
     */
    private static List<Content> createFileContents(String fileName, List<ContentVersion> contentVersions) {
        List<Content> fileContents = new List<Content>();
        for (ContentVersion cv : contentVersions) {
            fileContents.add(new Content(cv.Title + '.' + cv.FileExtension, EncodingUtil.base64Encode(cv.VersionData)));
        }
        return fileContents;
    }

    /**
     * Method to handle exceptions by logging and rethrowing as AuraHandledException.
     * @param ex The exception to handle.
     */
    private static void handleException(Exception ex) {
        System.debug('Error Occurred: ' + ex.getMessage());
        System.debug('Stack Trace: '+ex.getStackTraceString());
        throw new AuraHandledException(ex.getMessage());
    }

    /**
     * Inner class to represent content information.
     */
    public class Content {
        @AuraEnabled public String versionData { get; set; }
        @AuraEnabled public String fileName { get; set; }

        public Content(String fileName, String versionData) {
            this.fileName = fileName;
            this.versionData = versionData;
        }
    }

    /**
     * Inner class to represent file information.
     */
    public class FileWrapper {
        @AuraEnabled public String fileName { get; set; }
        @AuraEnabled public List<Content> contentData { get; set; }

        public FileWrapper(String fileName, List<Content> contentData) {
            this.fileName = fileName;
            this.contentData = contentData;
        }
    }
}