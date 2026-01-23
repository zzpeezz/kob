package com.kob.backend.controller.user;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
//组件注解（谁是“对象”)帮我创建对象（Bean）
@RestController//这个类专门用来返回数据（JSON），不是用来返回页面的
public class UserController {


    //注入注解（对象怎么用）这个对象我需要，你帮我注入
    @Autowired  //要用到数据库里的Mapper
    UserMapper userMapper;

                                    //请求注解(接口相关)：请求怎么进来、参数怎么传
    @GetMapping("/user/all/")   //只想映射某一种请求GetMapping PostMapping
    public List<User> getAll() {
        return userMapper.selectList(null);
    }
    @GetMapping("/user/{userId}/") //获取一个数据
    public User getUser(@PathVariable int userId) {   //@PathVariable = 从 URL 路径里取值
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("id", userId);
        return userMapper.selectOne(queryWrapper);
    }
    @GetMapping("/user/add/{userId}/{username}/{password}/") //
    public String addUser(@PathVariable int userId,
                          @PathVariable String username,
                          @PathVariable String password) {
            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String encodePassword = passwordEncoder.encode(password);
            User user = new User(userId, username, encodePassword);
            userMapper.insert(user);
            return "Add User successful";
    }
    @GetMapping("/user/delete/{userId}/")
    public String deleteUser(@PathVariable int userId) {
        userMapper.deleteById(userId);
        return "Delete User successful";
    }
}
