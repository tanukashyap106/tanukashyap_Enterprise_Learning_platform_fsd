package com.thinkconstructive.rest_demo.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.thinkconstructive.rest_demo.model.CloudStud;

@RestController
@RequestMapping("/cloudstud")
public class CloudStudController
{
    CloudStud cloudstud;

    @GetMapping("{studId}")
    public CloudStud getCloudStudDetails(String studId)
    {
        return cloudstud;
       
    }
    @PostMapping
    public String createCloudStudDetails(@RequestBody CloudStud cloudstud){
        this.cloudstud=cloudstud;
        return "Cloud Student Created Successfully";
    }
}

