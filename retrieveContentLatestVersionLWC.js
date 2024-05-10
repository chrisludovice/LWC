import { LightningElement,wire } from 'lwc';
import { gql, graphql } from "lightning/uiGraphQLApi";
import LightningAlert from "lightning/alert";

export default class RetrieveContentLatestVersionLWC extends LightningElement {
    graphResult;
    linkContent;
    contentIdentifierSelected;

    viewContent(event){
      event.preventDefault();
      this.contentIdentifierSelected = event.currentTarget.getAttribute('title');
    }
    get contentVar(){
      return {
        contentIdentifier: '%'+this.contentIdentifierSelected+'%'
      };
  }
    /* START ----- GraphQL for Content Version  ------- START */
    
    @wire(graphql, {
      query: gql`
        query retrieveContent($contentIdentifier: String) {
          uiapi {
            query {
              ContentVersion(first:1,
                where: { 
                  Title: { like: $contentIdentifier }
                  IsLatest: { eq: true}
                }
                orderBy: {  
                  LastModifiedDate: { order: DESC } 
                }
              ) {
                edges {
                  node {
                    Id
                    ContentDocumentId {
                      value
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: '$contentVar'
    })
    graphqlQueryResult({ data, error }) {
      if (data) {     
        this.graphResult = data.uiapi.query.ContentVersion.edges.map((edge) => edge.node);
        if(this.graphResult!=''){
	// play what you want with the results...example below:
          this.linkContent='URL of your Salesforce Instance'+this.graphResult[0].ContentDocumentId.value;
          window.open(this.linkContent);
        }
      }   
     else if(error){
        LightningAlert.open({
            message: "Error Found: "+this.error,
            theme: "error", 
            label: "Error Message", 
          });
     }
    }	
	 /* END ----- GraphQL for Content Version ------- END */
}
