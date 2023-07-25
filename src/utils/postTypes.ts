export type Post = {
    post_id:     string,
	UserID:      number,        
	PostContent: string,    
	CreatedAt:   string,  
	Likes:       number,        
	Comments:    number,        
	Liked:       boolean,
	media: 		 string[]
}