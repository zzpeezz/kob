package com.kob.backend.service.impl.utils;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.User;
import com.kob.backend.service.user.account.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RegisterServiceImpl implements RegisterService {

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Map<String, String> register(String username, String password, String confirmPassword) {
        Map<String, String> map = new HashMap<String, String>();
        if (username == null) {  //判断有没有参数
            map.put("error_message", "用户名不能为空");
            return map;
        }
        if (password == null || confirmPassword == null) {
            map.put("error_message", "密码不能为空");
            return map;
        }

        username = username.trim(); //删掉首位空白字符，回车啥的
        if (username.length() == 0) {  //判断长度是不是0的
            map.put("error_message", "用户名不能为空");
            return map;
        }
        if (password.length() == 0 || confirmPassword.length() == 0) {
            map.put("error_message", "密码不能为空");
            return map;
        }
        if (username.length() > 100) {
            map.put("error_message", "用户名长度不能大于100");
            return map;
        }
        if (password.length() > 100 || confirmPassword.length() > 100) {
            map.put("error_message", "密码长度不能大于100");
            return map;
        }
        if (!password.equals(confirmPassword)) {
            map.put("error_message", "两次输入的密码不一致");
            return map;
        }

        //查询数据库里是不是有用户名== username的用户
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        List<User> users = userMapper.selectList(queryWrapper);

        if (!users.isEmpty()) {
            map.put("error_message", "用户名已存在");
            return map;
        }
        String encodePassword = passwordEncoder.encode(password);
        String photo = "https://cdn.acwing.com/media/user/profile/photo/363615_lg_b031999e67.jpg";
        User user = new User(null, username, encodePassword, photo);  //Id是自增的，设为null
        userMapper.insert(user);
        map.put("error_message", "success");
        return map;
    }

}
